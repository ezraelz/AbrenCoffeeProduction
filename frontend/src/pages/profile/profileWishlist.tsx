import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import ConfirmModal from '../../component/confirmDelete';
import { useCart } from '../shop/useCart'; // ✅ Make sure this hook is available
import './profileWishlist.css';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface Wish {
  id: number;
  user: string;
  product: Product;
  added_at: string;
  quantity?: number;
}

const ITEMS_PER_PAGE = 5;

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<Wish[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get('/wishlist/list/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(response.data);
        console.log(response.data);
      } catch {
        console.error('❌ Failed to load wishlist.');
      }
    };

    fetchWishlist();
  }, []);

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setShowConfirm(false);
    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`/wishlist/delete/${deletingId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((wish) => wish.id !== deletingId));
      toast.success('✅ Item removed from wishlist!');
    } catch {
      toast.error('❌ Failed to delete item.');
    }
  };

  const totalPages = Math.ceil(wishlist.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = wishlist.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="wishlist">
      <div className="wishlist-container">
        <h2 className="wishlist-header">Your Wishlist</h2>

        {wishlist.length === 0 ? (
          <>
            <p>Your Wishlist is empty.</p>
            <button className='button-shop' onClick={() => navigate('/shop')}>Go to Shop</button>
          </>
          ) : (
          <>
            <ul className="wish-items-list">
              {paginatedItems.map((item) => (
                <li key={item.id} className="wish-item">
                  <img
                      src={item.product.image}
                      alt={item.product.name}
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg')
                      }
                      className="cart-item-image"
                    />
                  <div className="wish-item-info">
                    <span className="cart-item-name">{item.product.name} - ${item.product.price}</span>
                    <div className="cart-item-controls">
                      <button onClick={() => addItem({ ...item.product, stock: 1, quantity: 1 })}>Add to Cart</button>
                      <button onClick={() => navigate(`/product/${item.product.id}`)}>View</button>
                      <button onClick={() => handleDeleteClick(item.id)}>🗑️</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <div className="pagination">
              <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={currentPage === idx + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>

            <div className="button-group">
              <button onClick={() => navigate('/shop')}>Continue Shopping</button>
              <button onClick={() => navigate('/cart')}>View Cart</button>
            </div>
          </>
        )}

        {/* Delete Modal */}
        <ConfirmModal
          isOpen={showConfirm}
          title="Remove from Wishlist"
          message="Are you sure you want to remove this item?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </div>
  );
};

export default Wishlist;
