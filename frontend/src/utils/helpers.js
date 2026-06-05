export const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`;

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const renderStars = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  for (let i = 0; i < full; i++) stars.push('bi-star-fill');
  if (half) stars.push('bi-star-half');
  while (stars.length < 5) stars.push('bi-star');
  return stars;
};

export const truncate = (str, n) => str && str.length > n ? str.substr(0, n - 1) + '...' : str;

export const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0, 2);
};

export const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
