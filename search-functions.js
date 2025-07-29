// Hàm mở modal tìm kiếm
function openSearchModal() {
  const searchModal = document.getElementById('searchModal');
  if (searchModal) {
    searchModal.style.display = 'block';
    document.getElementById('searchInput').focus();
  }
}

// Hàm đóng modal tìm kiếm
function closeSearch() {
  const searchModal = document.getElementById('searchModal');
  if (searchModal) {
    searchModal.style.display = 'none';
  }
}

// Đóng modal khi click bên ngoài
window.addEventListener('click', function(event) {
  const searchModal = document.getElementById('searchModal');
  if (event.target === searchModal) {
    closeSearch();
  }
});

// Xử lý tìm kiếm
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('.search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput && searchInput.value.trim() !== '') {
        // Thực hiện tìm kiếm
        alert('Đang tìm kiếm: ' + searchInput.value);
        // Đóng modal sau khi tìm kiếm
        closeSearch();
      }
    });
  }
});