import { PropsWithChildren } from 'react';

type DialogProps = {
    open: boolean;
    header?: string;
};

export default function Dialog({ open, header, children }: PropsWithChildren<DialogProps>) {
    return (
        <dialog
            style={{
                zIndex: 1,
                alignSelf: 'center',
                padding: '2rem 3rem',
                textAlign: 'center',
                width: '40rem',
            }}
            open={open}
        >
            {header && <h4 style={{ marginTop: 0 }}>{header}</h4>}
            {children}
        </dialog>
    );
}
