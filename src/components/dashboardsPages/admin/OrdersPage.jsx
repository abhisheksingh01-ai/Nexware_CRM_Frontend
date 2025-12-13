import React, { useEffect, useState } from "react";
import OrderCard from "./orderPage/OrderCard";
import OrderTable from "./orderPage/OrderTable";
import OrderDetailsModal from "./orderPage/OrderDetailsModal";
import OrderHeader from "./orderPage/OrderHeader";
import OrderStats from "./orderPage/OrderStats";
import AddNewOrder from "./orderPage/AddNewOrder";
import api from "../../../api/api";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState("table");
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAddOrder, setOpenAddOrder] = useState(false);

  const { user: authUser } = useAuthStore();

  // 1. Fetch All Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(api.Order.GetAll, {
        headers: { Authorization: `Bearer ${authUser?.token}` },
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Handler: Receive full order details from Table
  const handleDetailsFetched = (orderData) => {
    setSelectedOrder(orderData);
  };

  // 3. Handler: Fallback for Card View (Fetch manually if needed)
  const handleCardClick = async (orderId) => {
    try {
        setLoading(true);
        const response = await axios.get(`${api.Order.GetOne}?orderId=${orderId}`, {
            headers: { Authorization: `Bearer ${authUser?.token}` },
        });
        setSelectedOrder(response.data.data);
    } catch (error) {
        console.error("Error fetching card details", error);
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <OrderHeader onAddClick={() => setOpenAddOrder(true)} />
      <OrderStats />

      <div className="p-10 min-h-screen bg-slate-50">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-500 text-sm">Manage and track your customer orders</p>
          </div>

          <div className="flex bg-white p-1 border border-slate-200 rounded-lg shadow-sm">
            <button
              onClick={() => setView("table")}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                view === "table" ? "bg-blue-100 text-blue-600" : "text-slate-500"
              }`}
            >
              Table List
            </button>
            <button
              onClick={() => setView("cards")}
              className={`px-4 py-2 rounded-md font-semibold transition ${
                view === "cards" ? "bg-blue-100 text-blue-600" : "text-slate-500"
              }`}
            >
              Grid Cards
            </button>
          </div>
        </div>

        {loading && <div className="text-center py-10">Loading orders...</div>}

        {!loading && view === "table" && (
          <OrderTable
            orders={orders}
            onRefresh={fetchOrders}
            onDetailsFetched={handleDetailsFetched} 
            onRowClick={(order) => handleCardClick(order._id || order.id)} 
          />
        )}
        {!loading && view === "cards" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((o) => (
              <OrderCard
                key={o.id || o._id}
                order={o}
                onClick={() => handleCardClick(o._id || o.id)}
              />
            ))}
          </div>
        )}
      </div>
      {openAddOrder && (
        <AddNewOrder
          onClose={() => setOpenAddOrder(false)}
          onSuccess={() => {
            setOpenAddOrder(false);
            fetchOrders();
          }}
        />
      )}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default OrdersPage;