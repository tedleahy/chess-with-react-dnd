import { PropsWithChildren } from 'react';

type DialogProps = {
    open: boolean;
    header?: string;
    backgroundColor?: string;
};

export default function Dialog({
    open,
    header,
    children,
    backgroundColor = 'white',
}: PropsWithChildren<DialogProps>) {
    return (
        <dialog
            style={{
                zIndex: 2,
                alignSelf: 'center',
                padding: '2rem 3rem',
                textAlign: 'center',
                width: '40rem',
                backgroundColor: backgroundColor,
            }}
            open={open}
        >
            {header && <h3 style={{ marginTop: 0 }}>{header}</h3>}
            {children}
        </dialog>
    );
}
