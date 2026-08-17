import { useEffect, useRef, useState } from "react";
import { blurAiApi } from '@/services/blurAiApi.js'



export default function RealtimeDetectionPage() {
    const videoRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const captureCanvasRef = useRef(null);

    const [detections, setDetections] = useState([]);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const isDetectingRef = useRef(false);


    useEffect(() => {
        startCamera();

        return () => {
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

            ctx.drawImage(
                video,
                0,
                0,
                640,
                640
            );

            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                video,
                0,
                0,
                416,
                416
            );

            canvas.toBlob(
                (blob) => resolve(blob),
                "image/webp",
                0.5
            );
        });
    };

    const detectFrame = async () => {
        if (isDetectingRef.current) return;

        try {
            isDetectingRef.current = true;

            const imageBlob = await captureFrame();

            if (!imageBlob) return;

            const start = performance.now();

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
            }
            else if (
                Array.isArray(
                    result?.detections
                )
            ) {
                detectedObjects =
                    result.detections;
            }
            else if (result?.box) {
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
            isDetectingRef.current = false;

            setTimeout(() => {
                detectFrame();
            }, 50);
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

            const scaleX = canvas.width / 640;
            const scaleY = canvas.height / 640;

            ctx.strokeRect(
                box.x * scaleX,
                box.y * scaleY,
                box.width * scaleX,
                box.height * scaleY
            );

            ctx.fillStyle = "red";
            ctx.font = "18px Arial";

            ctx.fillText(
                `${item.class} ${(item.confidence * 100).toFixed(1)}%`,
                box.x * scaleX,
                Math.max(
                    20,
                    box.y * scaleY - 5
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
            objectFit: "contain",
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