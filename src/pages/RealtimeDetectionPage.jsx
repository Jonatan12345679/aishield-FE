import { useEffect, useRef, useState } from "react";
import { blurAiApi } from '@/services/blurAiApi.js'


export default function RealtimeDetectionPage() {
    const videoRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const captureCanvasRef = useRef(null);

    const [detections, setDetections] = useState([]);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    useEffect(() => {
        if (!isCameraReady) return;

        const interval = setInterval(() => {
            detectFrame();
        }, 300);

        return () => clearInterval(interval);
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

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = () => {
                    setIsCameraReady(true);
                };
            }
        } catch (error) {
            console.error(error);
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

            const ctx =
                canvas.getContext("2d");

            ctx.drawImage(
                video,
                0,
                0,
                640,
                640
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
        if (isDetecting) return;

        try {
            setIsDetecting(true);

            const imageBlob =
                await captureFrame();

            if (!imageBlob) return;

            const result = await blurAiApi.realtimePrivacy(
                imageBlob
            );

            console.log(result);

            let detectedObjects = [];

            if (Array.isArray(result)) {
                detectedObjects = result;
            }
            else if (Array.isArray(result?.detections)) {
                detectedObjects = result.detections;
            }
            else if (result?.box) {
                detectedObjects = [result];
            }

            console.log(
                "DETECTED:",
                detectedObjects
            );

            // let detectedObjects = [];

            if (
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
            console.error(error);
        } finally {
            setIsDetecting(false);
        }
    };

    const drawDetections = (items) => {
        const canvas =
            overlayCanvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext("2d");

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        items.forEach((item) => {

            const box = item.box;

            if (!box) return;

            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;

            ctx.strokeRect(
                box.x,
                box.y,
                box.width,
                box.height
            );

            ctx.fillStyle = "red";
            ctx.font = "18px Arial";

            ctx.fillText(
                `${item.class} ${(item.confidence * 100).toFixed(1)}%`,
                box.x,
                Math.max(
                    20,
                    box.y - 5
                )
            );
        });
    };

    return (
        <div
            style={{
                padding: "20px",
            }}
        >
            <h1>
                AIShield Realtime Privacy
                Detection
            </h1>

<div
    style={{
        position: "relative",
        width: "800px",
        height: "600px",
        border: "1px solid #ccc",
        overflow: "hidden",
    }}
>
    <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
        }}
    />

    <canvas
        ref={overlayCanvasRef}
        width={800}
        height={600}
        style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
        }}
    />
</div>

            <canvas
                ref={captureCanvasRef}
                style={{
                    display: "none",
                }}
            />

            <div
                style={{
                    marginTop: "20px",
                }}
            >
                <h3>
                    Detection Result
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