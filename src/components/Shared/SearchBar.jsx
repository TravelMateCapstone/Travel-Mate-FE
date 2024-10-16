import React from 'react';

function SearchBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '5px', padding: '5px', height: '38px' }}>
      <link rel="stylesheet" href="https://unpkg.com/ionicons@5.5.2/dist/ionicons.min.css" />
      <ion-icon name="search" style={{ marginRight: '5px' }}></ion-icon>
      <input type="text" placeholder="Tìm kiếm..." style={{ border: 'none', outline: 'none', flex: 1 }} />
    </div>
  );
}

export default SearchBar;
