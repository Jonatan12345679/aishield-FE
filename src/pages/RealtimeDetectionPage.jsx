import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Aperture, Download, RotateCcw, ShieldCheck, IdCard, QrCode, Car, Receipt } from "lucide-react";
import "@/assets/styles/RealtimeDetectionPage.css";
import Header from '@/components/layout/Header'

import { blurAiApi } from "@/services/blurAiApi.js";



const MODEL_SIZE = 640;

const CLASS_META = {
    ktp: { label: "KTP", color: "#4cc2ff", icon: IdCard },
    qr: { label: "QR CODE", color: "#e06bd1", icon: QrCode },
    plat_nomor: { label: "PLAT NOMOR", color: "#f0c419", icon: Car },
    struk: { label: "STRUK", color: "#4caf6b", icon: Receipt },
};

function classMeta(cls) {
    return (
        CLASS_META[cls] ?? {
            label: cls.replace(/_/g, " ").toUpperCase(),
            color: "#8bac0f",
            icon: ShieldCheck,
        }
    );
}

function ViewfinderLoader({ label }) {
    return (
        <div className="pc-loader-wrap">
            <div className="pc-loader-ring" role="status" aria-label={label}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} style={{ "--i": i }} />
                ))}
            </div>
            <div className="font-pixel-display text-[8px] text-[#8bac0f] animate-pc-blink">
                {label}
            </div>
        </div>
    );
}

export default function RealtimeDetectionPage() {
    const videoRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const captureCanvasRef = useRef(null);

    const [detections, setDetections] = useState([]);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const [captureState, setCaptureState] = useState("idle"); // idle | processing | ejected
    const [capturedImage, setCapturedImage] = useState(null);
    const [isDeveloped, setIsDeveloped] = useState(false);
    const [captureError, setCaptureError] = useState(null);

    const isDetectingRef = useRef(false);
    const isMountedRef = useRef(true);
    const isCapturingRef = useRef(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: { ideal: "environment" },
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });

            if (!videoRef.current) return;
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => setIsCameraReady(true);
        } catch (error) {
            console.error("Camera error:", error);
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        if (!stream) return;
        stream.getTracks().forEach((track) => track.stop());
    };

    const captureFrame = () => {
        return new Promise((resolve) => {
            const video = videoRef.current;
            const canvas = captureCanvasRef.current;
            if (!video || !canvas) return resolve(null);

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            if (!videoWidth || !videoHeight) return resolve(null);

            canvas.width = MODEL_SIZE;
            canvas.height = MODEL_SIZE;

            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);

            const cropSize = Math.min(videoWidth, videoHeight);
            const sourceX = (videoWidth - cropSize) / 2;
            const sourceY = (videoHeight - cropSize) / 2;

            ctx.clearRect(0, 0, MODEL_SIZE, MODEL_SIZE);
            ctx.drawImage(video, sourceX, sourceY, cropSize, cropSize, 0, 0, MODEL_SIZE, MODEL_SIZE);
            canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
        });
    };

    const detectFrame = async () => {
        if (isDetectingRef.current || !isMountedRef.current) return;

        if (isCapturingRef.current) {
            setTimeout(() => detectFrame(), 200);
            return;
        }

        try {
            isDetectingRef.current = true;

            const imageBlob = await captureFrame();
            if (!imageBlob) return;

            const result = await blurAiApi.realtimePrivacy(imageBlob);

            let detectedObjects = [];
            if (Array.isArray(result)) {
                detectedObjects = result;
            } else if (Array.isArray(result?.detections)) {
                detectedObjects = result.detections;
            } else if (result?.box) {
                detectedObjects = [result];
            }

            setDetections(detectedObjects);
            drawDetections(detectedObjects);
        } catch (error) {
            console.error("Detection error:", error);
        } finally {
            isDetectingRef.current = false;
            if (isMountedRef.current) {
                setTimeout(() => detectFrame(), 50);
            }
        }
    };

    const drawDetections = (items) => {
        const canvas = overlayCanvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const rect = video.getBoundingClientRect();
        const displayWidth = rect.width;
        const displayHeight = rect.height;
        if (displayWidth <= 0 || displayHeight <= 0) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, displayWidth, displayHeight);

        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        if (!videoWidth || !videoHeight) return;

        const cropSize = Math.min(videoWidth, videoHeight);
        const cropOffsetX = (videoWidth - cropSize) / 2;
        const cropOffsetY = (videoHeight - cropSize) / 2;
        const modelToVideo = cropSize / MODEL_SIZE;
        const displayScaleX = displayWidth / videoWidth;
        const displayScaleY = displayHeight / videoHeight;


        const coverScale = Math.max(
            displayWidth / videoWidth,
            displayHeight / videoHeight
        );
        const renderedVideoWidth = videoWidth * coverScale;
        const renderedVideoHeight = videoHeight * coverScale;
        const offsetX = (displayWidth - renderedVideoWidth) / 2;
        const offsetY = (displayHeight - renderedVideoHeight) / 2;

        
        items.forEach((item) => {
            const box = item?.box;
            if (!box) return;

            const videoX = cropOffsetX + box.x * modelToVideo;
            const videoY = cropOffsetY + box.y * modelToVideo;
            const videoWidthBox = box.width * modelToVideo;
            const videoHeightBox = box.height * modelToVideo;

            const x = offsetX + videoX * coverScale;
            const y = offsetY + videoY * coverScale;
            const width = videoWidthBox * coverScale;
            const height = videoHeightBox * coverScale;

            const meta = classMeta(item.class);

            ctx.strokeStyle = meta.color;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = meta.color;
            ctx.font = "12px 'Press Start 2P', monospace";
            ctx.fillText(`${meta.label} ${(item.confidence * 100).toFixed(0)}%`, x, Math.max(16, y - 6));
        });
    };

    const captureFullResFrame = () => {
        return new Promise((resolve) => {
            const video = videoRef.current;
            if (!video) return resolve(null);

            const videoWidth = video.videoWidth;
            const videoHeight = video.videoHeight;
            if (!videoWidth || !videoHeight) return resolve(null);

            const canvas = document.createElement("canvas");
            canvas.width = videoWidth;
            canvas.height = videoHeight;

            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(null);

            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
            canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
        });
    };

    const triggerDownload = (imageUrl, filename) => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShutterPress = useCallback(async () => {
        if (!isCameraReady || captureState === "processing") return;

        try {
            isCapturingRef.current = true;
            setCaptureError(null);
            setIsDeveloped(false);
            setCaptureState("processing");

            const frameBlob = await captureFullResFrame();
            if (!frameBlob) throw new Error("Gagal mengambil gambar dari kamera.");

            const result = await blurAiApi.blurPrivacy(frameBlob);
            const imageUrl = result?.image;
            if (!imageUrl) throw new Error("Gagal memproses privacy blur.");

            setCapturedImage(imageUrl);
            setCaptureState("ejected");

            setTimeout(() => setIsDeveloped(true), 120);

            triggerDownload(imageUrl, `blurai-pocket-${Date.now()}.jpg`);
        } catch (error) {
            console.error("Capture/blur error:", error);
            setCaptureError(error.message || "Gagal mengambil & blur foto.");
            setCaptureState("idle");
            isCapturingRef.current = false;
        }
    }, [isCameraReady, captureState]);

    const handleNewShot = useCallback(() => {
        setCapturedImage(null);
        setIsDeveloped(false);
        setCaptureState("idle");
        setCaptureError(null);
        isCapturingRef.current = false;
    }, []);

    const handleRedownload = useCallback(() => {
        if (!capturedImage) return;
        triggerDownload(capturedImage, `blurai-pocket-${Date.now()}.jpg`);
    }, [capturedImage]);

    useEffect(() => {
        startCamera();
        return () => {
            isMountedRef.current = false;
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (!isCameraReady) return;
        detectFrame();
    }, [isCameraReady]);

    const detectedClasses = useMemo(() => {
        const seen = new Map();
        detections.forEach((d) => {
            if (!seen.has(d.class)) seen.set(d.class, classMeta(d.class));
        });
        return Array.from(seen.values());
    }, [detections]);

    return (
        <div className="pc-page">
            <div className="pc-page-inner">
            <Header className="relative z-10" />

                <h1 className="font-pixel-display text-sm sm:text-base text-center text-[#e8dcc8] mb-8 tracking-wider mt-10">
                    BLUR<span className="text-[#4cc2ff]">AI</span> INSTANT
                </h1>

                <div className="pc-stage">
                    <div className="pc-stage-camera">
                        <div className="pc-camera">
                            <div className="pc-camera-top">
                                <span className={`pc-tally ${isCameraReady ? "pc-tally-on" : ""}`} />
                                <span className="font-pixel-display text-[7px] text-[#5a5240] tracking-widest">
                                    PRIVACY·CAM 8BIT
                                </span>
                                <span className="pc-stripe" aria-hidden="true">
                                    <span /><span /><span /><span />
                                </span>
                            </div>

                            <div className="pc-viewfinder-bezel">
                                <span className="pc-lens-ring" aria-hidden="true" />
                                <div className="pc-viewfinder">
                                    <video ref={videoRef} autoPlay muted playsInline className="pc-viewfinder-video" />
                                    <canvas ref={overlayCanvasRef} className="pc-viewfinder-overlay" />

                                    {!isCameraReady && (
                                        <div className="pc-viewfinder-boot">
                                            <span className="font-pixel-display text-[8px] text-[#8bac0f] animate-pc-blink">
                                                ▸ STARTING CAMERA ◂
                                            </span>
                                        </div>
                                    )}

                                    {captureState === "processing" && (
                                        <div className="pc-viewfinder-flash">
                                            <ViewfinderLoader label="> DEVELOPING..." />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pc-lcd-strip font-pixel-display">
                                <span>{isCameraReady ? "SCAN:ON " : "SCAN:-- "}</span>
                                <span>FOUND:{String(detections.length).padStart(2, "0")}</span>
                            </div>

                            <button
                                type="button"
                                onClick={handleShutterPress}
                                disabled={!isCameraReady || captureState === "processing"}
                                className="pc-shutter"
                                title="Capture & Blur"
                            >
                                <Aperture size={20} />
                            </button>

                            <div className="pc-film-slot" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="pc-stage-output">
                        <div className="pc-output-slot">
                            {captureState !== "idle" && capturedImage ? (
                                <div className={`pc-polaroid ${isDeveloped ? "pc-polaroid-out" : ""}`}>
                                    <div className="pc-polaroid-photo">
                                        <img
                                            src={capturedImage}
                                            alt="Captured & blurred"
                                            className={`pc-polaroid-img ${isDeveloped ? "pc-developed" : "pc-developing"}`}
                                        />
                                    </div>
                                    <div className="pc-polaroid-caption font-pixel-body">
                                        BLURAI POCKET · {new Date().toLocaleDateString()}
                                    </div>
                                    <div className="pc-polaroid-actions">
                                        <button type="button" onClick={handleRedownload} className="pc-mini-btn">
                                            <Download size={12} /> SAVE
                                        </button>
                                        <button type="button" onClick={handleNewShot} className="pc-mini-btn">
                                            <RotateCcw size={12} /> NEW SHOT
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pc-output-empty font-pixel-body">
                                    ▸ TEKAN SHUTTER UNTUK<br />MENGAMBIL FOTO ◂
                                </div>
                            )}
                        </div>

                        {captureError && (
                            <div className="pc-error font-pixel-body text-center mt-3">ERR: {captureError}</div>
                        )}

                        {detectedClasses.length > 0 && (
                            <div className="pc-hud">
                                <span className="font-pixel-display text-[7px] text-[#8bac0f] block mb-2">
                                    DETECTED CLASSES
                                </span>
                                <div className="pc-hud-chips">
                                    {detectedClasses.map((meta) => {
                                        const Icon = meta.icon;
                                        return (
                                            <span
                                                key={meta.label}
                                                className="pc-chip"
                                                style={{ borderColor: meta.color, color: meta.color }}
                                            >
                                                <Icon size={10} />
                                                {meta.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <canvas ref={captureCanvasRef} style={{ display: "none" }} />
        </div>
    );
}