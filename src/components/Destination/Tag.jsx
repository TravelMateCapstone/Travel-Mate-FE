import React from 'react';

function Tag({ label, onRemove }) {
    return (
        <div
            className="tag_hobbies d-flex p-1 rounded-3 gap-1 border-1 align-items-center"
            style={{
                width: 'fit-content',
                border: '1px solid #E0E0E0',
            }}
        >
            <ion-icon name="pricetags-outline"></ion-icon>
            <p className="m-0">{label}</p>
            <ion-icon name="close-outline" onClick={onRemove}></ion-icon>
        </div>
    );
}

export default Tag;
