interface OverlayProps {
    color: string;
}

export default function Overlay({ color }: OverlayProps) {
    return (
        <div
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                backgroundColor: color,
                zIndex: 1,
                opacity: 0.5,
                pointerEvents: 'none',
            }}
        />
    );
}
