import { useEffect, useRef, useState } from "react";
import { blurAiApi } from "@/services/blurAiApi.js";

const MODEL_SIZE = 640;

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
                        facingMode: {
                            ideal: "environment",
                        },
                        width: {
                            ideal: 1280,
                        },
                        height: {
                            ideal: 720,
                        },
                    },
                    audio: false,
                });

            if (!videoRef.current) return;

            videoRef.current.srcObject = stream;

            videoRef.current.onloadedmetadata = () => {
                console.log(
                    "Camera resolution:",
                    videoRef.current.videoWidth,
                    "x",
                    videoRef.current.videoHeight
                );

                setIsCameraReady(true);
            };
        } catch (error) {
            console.error(
                "Camera error:",
                error
            );
        }
    };

    const stopCamera = () => {
        const stream =
            videoRef.current?.srcObject;

        if (!stream) return;

        stream
            .getTracks()
            .forEach((track) => {
                track.stop();
            });
    };

    /*
     * Capture video menjadi 640x640
     *
     * IMPORTANT:
     * Kita menggunakan crop yang sama dengan
     * area yang benar-benar dikirim ke backend.
     */
    const captureFrame = () => {
        return new Promise((resolve) => {
            const video =
                videoRef.current;

            const canvas =
                captureCanvasRef.current;

            if (!video || !canvas) {
                resolve(null);
                return;
            }

            const videoWidth =
                video.videoWidth;

            const videoHeight =
                video.videoHeight;

            if (
                !videoWidth ||
                !videoHeight
            ) {
                resolve(null);
                return;
            }

            canvas.width =
                MODEL_SIZE;

            canvas.height =
                MODEL_SIZE;

            const ctx =
                canvas.getContext("2d");

            if (!ctx) {
                resolve(null);
                return;
            }

            /*
             * Ambil bagian tengah video
             * berbentuk persegi.
             */
            const cropSize =
                Math.min(
                    videoWidth,
                    videoHeight
                );

            const sourceX =
                (videoWidth -
                    cropSize) /
                2;

            const sourceY =
                (videoHeight -
                    cropSize) /
                2;

            ctx.clearRect(
                0,
                0,
                MODEL_SIZE,
                MODEL_SIZE
            );

            ctx.drawImage(
                video,
                sourceX,
                sourceY,
                cropSize,
                cropSize,
                0,
                0,
                MODEL_SIZE,
                MODEL_SIZE
            );

            canvas.toBlob(
                (blob) => {
                    resolve(blob);
                },
                "image/jpeg",
                0.8
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
            isDetectingRef.current =
                true;

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
                detectedObjects =
                    result;
            } else if (
                Array.isArray(
                    result?.detections
                )
            ) {
                detectedObjects =
                    result.detections;
            } else if (
                result?.box
            ) {
                detectedObjects = [
                    result,
                ];
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
            isDetectingRef.current =
                false;

            if (
                isMountedRef.current
            ) {
                setTimeout(() => {
                    detectFrame();
                }, 50);
            }
        }
    };

    /*
     * Mapping:
     *
     * Backend:
     * 640 x 640
     *
     * Video:
     * ukuran asli kamera
     *
     * Kita harus mengembalikan koordinat
     * dari crop 640x640 ke posisi video.
     */
    const drawDetections = (items) => {
        const canvas =
            overlayCanvasRef.current;

        const video =
            videoRef.current;

        if (!canvas || !video) {
            return;
        }

        const rect =
            video.getBoundingClientRect();

        const displayWidth =
            rect.width;

        const displayHeight =
            rect.height;

        if (
            displayWidth <= 0 ||
            displayHeight <= 0
        ) {
            return;
        }

        /*
         * Canvas harus sama persis dengan
         * ukuran tampilan video.
         */
        const dpr =
            window.devicePixelRatio || 1;

        canvas.width =
            displayWidth * dpr;

        canvas.height =
            displayHeight * dpr;

        canvas.style.width =
            `${displayWidth}px`;

        canvas.style.height =
            `${displayHeight}px`;

        const ctx =
            canvas.getContext("2d");

        if (!ctx) return;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        ctx.clearRect(
            0,
            0,
            displayWidth,
            displayHeight
        );

        /*
         * Ukuran asli kamera.
         */
        const videoWidth =
            video.videoWidth;

        const videoHeight =
            video.videoHeight;

        if (
            !videoWidth ||
            !videoHeight
        ) {
            return;
        }

        /*
         * Karena captureFrame mengambil
         * crop persegi dari tengah kamera,
         * kita harus mengetahui crop tersebut.
         */
        const cropSize =
            Math.min(
                videoWidth,
                videoHeight
            );

        const cropOffsetX =
            (videoWidth -
                cropSize) /
            2;

        const cropOffsetY =
            (videoHeight -
                cropSize) /
            2;

        /*
         * Mapping koordinat model
         * kembali ke koordinat video asli.
         */
        const modelToVideo =
            cropSize / MODEL_SIZE;

        /*
         * Kemudian video asli dipetakan
         * ke ukuran video di layar.
         */
        const displayScaleX =
            displayWidth /
            videoWidth;

        const displayScaleY =
            displayHeight /
            videoHeight;

        items.forEach((item) => {
            const box =
                item?.box;

            if (!box) return;

            /*
             * Dari model 640
             * ke video asli.
             */
            const videoX =
                cropOffsetX +
                box.x *
                    modelToVideo;

            const videoY =
                cropOffsetY +
                box.y *
                    modelToVideo;

            const videoWidthBox =
                box.width *
                modelToVideo;

            const videoHeightBox =
                box.height *
                modelToVideo;

            /*
             * Dari video asli
             * ke ukuran layar.
             */
            const x =
                videoX *
                displayScaleX;

            const y =
                videoY *
                displayScaleY;

            const width =
                videoWidthBox *
                displayScaleX;

            const height =
                videoHeightBox *
                displayScaleY;

            ctx.strokeStyle =
                "red";

            ctx.lineWidth = 3;

            ctx.strokeRect(
                x,
                y,
                width,
                height
            );

            ctx.fillStyle =
                "red";

            ctx.font =
                "16px Arial";

            const label =
                `${item.class} ${(
                    item.confidence *
                    100
                ).toFixed(1)}%`;

            ctx.fillText(
                label,
                x,
                Math.max(
                    20,
                    y - 6
                )
            );
        });
    };

    return (
        <div
            style={{
                width: "100%",
                padding: "20px",
                boxSizing:
                    "border-box",
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

                    width: "100%",

                    maxWidth:
                        "800px",

                    margin:
                        "0 auto",

                    overflow:
                        "hidden",

                    background:
                        "#000",
                }}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                        display:
                            "block",

                        width:
                            "100%",

                        height:
                            "auto",

                        objectFit:
                            "contain",
                    }}
                />

                <canvas
                    ref={
                        overlayCanvasRef
                    }
                    style={{
                        position:
                            "absolute",

                        top: 0,
                        left: 0,

                        width:
                            "100%",

                        height:
                            "100%",

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
                    display:
                        "none",
                }}
            />

            <div
                style={{
                    marginTop:
                        "20px",
                }}
            >
                <h3>
                    Detection Result
                </h3>

                <pre
                    style={{
                        overflowX:
                            "auto",
                    }}
                >
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