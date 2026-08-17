import { useEffect, useRef, useState } from "react";
import { blurAiApi } from "@/services/blurAiApi.js";

export default function RealtimeDetectionPage() {
    const videoRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const captureCanvasRef = useRef(null);

    const [detections, setDetections] = useState([]);
    const [isCameraReady, setIsCameraReady] = useState(false);

    const isDetectingRef = useRef(false);
    const isMountedRef = useRef(true);

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

    const startCamera = async () => {
        try {
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment",
                    },
                    audio: false,
                });

            if (!videoRef.current) return;

            videoRef.current.srcObject = stream;

            videoRef.current.onloadedmetadata = () => {
                setIsCameraReady(true);
            };
        } catch (error) {
            console.error("Camera error:", error);
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;

        if (!stream) return;

        stream
            .getTracks()
            .forEach((track) => track.stop());
    };

    const captureFrame = () => {
        return new Promise((resolve) => {
            const video = videoRef.current;
            const canvas = captureCanvasRef.current;

            if (!video || !canvas) {
                resolve(null);
                return;
            }

            canvas.width = 640;
            canvas.height = 640;

            const ctx = canvas.getContext("2d");

            if (!ctx) {
                resolve(null);
                return;
            }

            ctx.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            ctx.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
            );

            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                "image/webp",
                0.5
            );
        });
    };

    const detectFrame = async () => {
        if (
            isDetectingRef.current ||
            !isMountedRef.current
        ) {
            return;
        }

        try {
            isDetectingRef.current = true;

            const imageBlob =
                await captureFrame();

            if (!imageBlob) {
                return;
            }

            const start =
                performance.now();

            const result =
                await blurAiApi.realtimePrivacy(
                    imageBlob
                );

            console.log(
                "Inference:",
                (
                    performance.now() -
                    start
                ).toFixed(0),
                "ms"
            );

            let detectedObjects = [];

            if (Array.isArray(result)) {
                detectedObjects = result;
            } else if (
                Array.isArray(
                    result?.detections
                )
            ) {
                detectedObjects =
                    result.detections;
            } else if (result?.box) {
                detectedObjects = [result];
            }

            setDetections(
                detectedObjects
            );

            drawDetections(
                detectedObjects
            );
        } catch (error) {
            console.error(
                "Detection error:",
                error
            );
        } finally {
            isDetectingRef.current = false;

            if (
                isMountedRef.current
            ) {
                setTimeout(() => {
                    detectFrame();
                }, 50);
            }
        }
    };

    const drawDetections = (
        detections
    ) => {
        const canvas =
            overlayCanvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext("2d");

        if (!ctx) return;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        const scaleX =
            canvas.width / 640;

        const scaleY =
            canvas.height / 640;

        detections.forEach(
            (detection) => {
                const box =
                    detection.box;

                if (!box) return;

                const x =
                    box.x * scaleX;

                const y =
                    box.y * scaleY;

                const width =
                    box.width *
                    scaleX;

                const height =
                    box.height *
                    scaleY;

                ctx.strokeStyle =
                    "red";

                ctx.lineWidth = 4;

                ctx.strokeRect(
                    x,
                    y,
                    width,
                    height
                );

                ctx.fillStyle =
                    "red";

                ctx.font =
                    "18px Arial";

                ctx.fillText(
                    `${detection.class} ${(
                        detection.confidence *
                        100
                    ).toFixed(1)}%`,
                    x,
                    Math.max(
                        20,
                        y - 5
                    )
                );
            }
        );
    };

    return (
        <div
            style={{
                padding: 20,
            }}
        >
            <h1>
                AIShield Realtime
                Privacy Detection
            </h1>

            <div
                style={{
                    position:
                        "relative",
                    width: 800,
                    height: 600,
                    border:
                        "1px solid #ccc",
                    overflow:
                        "hidden",
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        position:
                            "absolute",
                        top: 0,
                        left: 0,
                        width:
                            "100%",
                        height:
                            "100%",
                        objectFit:
                            "contain",
                        zIndex: 1,
                    }}
                />

                <canvas
                    ref={
                        overlayCanvasRef
                    }
                    width={800}
                    height={600}
                    style={{
                        position:
                            "absolute",
                        top: 0,
                        left: 0,
                        width:
                            "100%",
                        height:
                            "100%",
                        zIndex: 2,
                        pointerEvents:
                            "none",
                    }}
                />
            </div>

            <canvas
                ref={
                    captureCanvasRef
                }
                style={{
                    display: "none",
                }}
            />

            <div
                style={{
                    marginTop: 20,
                }}
            >
                <h3>
                    Detection
                    Result
                </h3>

                <pre>
                    {JSON.stringify(
                        detections,
                        null,
                        2
                    )}
                </pre>
            </div>
        </div>
    );
}