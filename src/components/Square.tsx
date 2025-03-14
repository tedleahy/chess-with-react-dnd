import { PropsWithChildren } from 'react';

interface SquareProps {
    color: string;
}

export default function Square({ color, children }: PropsWithChildren<SquareProps>) {
    return (
        <div
            style={{
                backgroundColor: color,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    );
}
