'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Package, TrendingUp, DollarSign, ShoppingCart, Plus, X } from 'lucide-react';

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const sizes = ['2ft', '3ft', '4ft', '5ft', '6ft', '7ft', '8ft', '9ft+'];
  const accessoryNames = {
    metalStand: 'Metal Stand',
    plasticStand: 'Plastic Stand',
    artificialWreath: 'Artificial Wreath',
    handmadeWreath: 'Handmade Wreath',
    hollyWreath: 'Holly Wreath',
    smallReindeer: 'Small Reindeer',
    mediumReindeer: 'Medium Reindeer',
    largeReindeer: 'Large Reindeer'
  };

  const [sales, setSales] = useState([]);
  const [stock, setStock] = useState({
    trees: {
      nordmann: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
      fraser: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
      spruce: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
      pot: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 }
    },
    accessories: {
      metalStand: 0,
      plasticStand: 0,
      artificialWreath: 0,
      handmadeWreath: 0,
      hollyWreath: 0,
      smallReindeer: 0,
      mediumReindeer: 0,
      largeReindeer: 0
    }
  });

  const [stockHistory, setStockHistory] = useState([]);
  const [newStock, setNewStock] = useState({
    trees: {
      nordmann: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
      fraser: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
      spruce: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
      pot: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 }
    },
    accessories: {
      metalStand: 0,
      plasticStand: 0,
      artificialWreath: 0,
      handmadeWreath: 0,
      hollyWreath: 0,
      smallReindeer: 0,
      mediumReindeer: 0,
      largeReindeer: 0
    }
  });

  const [prices, setPrices] = useState({
    trees: {
      nordmann: { '2ft': 20, '3ft': 25, '4ft': 30, '5ft': 40, '6ft': 50, '7ft': 75, '8ft': 90, '9ft+': 100 },
      fraser: { '2ft': 20, '3ft': 25, '4ft': 30, '5ft': 35, '6ft': 45, '7ft': 65, '8ft': 90, '9ft+': 100 },
      spruce: { '2ft': 20, '3ft': 25, '4ft': 30, '5ft': 25, '6ft': 35, '7ft': 50, '8ft': 90, '9ft+': 100 },
      pot: { '2ft': 20, '3ft': 25, '4ft': 30, '5ft': 40, '6ft': 40, '7ft': 40, '8ft': 40, '9ft+': 40 }
    },
    accessories: {
      metalStand: 15,
      plasticStand: 10,
      artificialWreath: 5,
      handmadeWreath: 15,
      hollyWreath: 7.5,
      smallReindeer: 30,
      mediumReindeer: 40,
      largeReindeer: 70
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const stockRes = await fetch('/api/stock');
      const stockData = await stockRes.json();
      
      const salesRes = await fetch('/api/sales');
      const salesData = await salesRes.json();
      
      const historyRes = await fetch('/api/stock-history');
      const historyData = await historyRes.json();

      // Transform stock data
      if (stockData.trees && stockData.trees.length > 0) {
        const transformedStock = {
          trees: {
            nordmann: {},
            fraser: {},
            spruce: {},
            pot: {}
          },
          accessories: {}
        };

        stockData.trees.forEach(tree => {
          if (!transformedStock.trees[tree.type]) {
            transformedStock.trees[tree.type] = {};
          }
          transformedStock.trees[tree.type][tree.size] = tree.quantity;
        });

        stockData.accessories.forEach(acc => {
          const key = Object.keys(accessoryNames).find(k => accessoryNames[k] === acc.name);
          if (key) {
            transformedStock.accessories[key] = acc.quantity;
          }
        });

        setStock(transformedStock);
      }

      setSales(salesData || []);
      setStockHistory(historyData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateNewTreeStock = (treeType, size, value) => {
    setNewStock(prev => ({
      ...prev,
      trees: {
        ...prev.trees,
        [treeType]: {
          ...prev.trees[treeType],
          [size]: parseInt(value) || 0
        }
      }
    }));
  };

  const updateNewAccessoryStock = (accessory, value) => {
    setNewStock(prev => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accessory]: parseInt(value) || 0
      }
    }));
  };

  const handleAddStock = async () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const treesToUpdate = [];
    const accessoriesToUpdate = [];
    const historyEntries = [];

    Object.entries(newStock.trees).forEach(([treeType, treeSizes]) => {
      Object.entries(treeSizes).forEach(([size, qty]) => {
        if (qty > 0) {
          treesToUpdate.push({
            type: treeType,
            size: size,
            quantity: stock.trees[treeType][size] + qty,
            price: prices.trees[treeType][size]
          });

          historyEntries.push({
            type: 'delivery',
            item: `${treeType.charAt(0).toUpperCase() + treeType.slice(1)} ${size}`,
            quantity: qty,
            notes: 'Stock delivery'
          });
        }
      });
    });

    Object.entries(newStock.accessories).forEach(([accessory, qty]) => {
      if (qty > 0) {
        accessoriesToUpdate.push({
          name: accessoryNames[accessory],
          quantity: stock.accessories[accessory] + qty,
          price: prices.accessories[accessory]
        });

        historyEntries.push({
          type: 'delivery',
          item: accessoryNames[accessory],
          quantity: qty,
          notes: 'Stock delivery'
        });
      }
    });

    try {
      await fetch('/api/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trees: treesToUpdate,
          accessories: accessoriesToUpdate
        })
      });

      for (const entry of historyEntries) {
        await fetch('/api/stock-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
      }

      setNewStock({
        trees: {
          nordmann: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
          fraser: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
          spruce: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 },
          pot: { '2ft': 0, '3ft': 0, '4ft': 0, '5ft': 0, '6ft': 0, '7ft': 0, '8ft': 0, '9ft+': 0 }
        },
        accessories: {
          metalStand: 0,
          plasticStand: 0,
          artificialWreath: 0,
          handmadeWreath: 0,
          hollyWreath: 0,
          smallReindeer: 0,
          mediumReindeer: 0,
          largeReindeer: 0
        }
      });
      
      setShowAddStockModal(false);
      alert('Stock added successfully!');
      fetchData();
    } catch (error) {
      alert('Error adding stock: ' + error.message);
    }
  };

  const updateTreePrice = async (treeType, size, newPrice) => {
    setPrices(prev => ({
      ...prev,
      trees: {
        ...prev.trees,
        [treeType]: {
          ...prev.trees[treeType],
          [size]: parseFloat(newPrice) || 0
        }
      }
    }));

    try {
      await fetch('/api/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trees: [{
            type: treeType,
            size: size,
            quantity: stock.trees[treeType][size],
            price: parseFloat(newPrice) || 0
          }]
        })
      });
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const updateAccessoryPrice = async (accessory, newPrice) => {
    setPrices(prev => ({
      ...prev,
      accessories: {
        ...prev.accessories,
        [accessory]: parseFloat(newPrice) || 0
      }
    }));

    try {
      await fetch('/api/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessories: [{
            name: accessoryNames[accessory],
            quantity: stock.accessories[accessory],
            price: parseFloat(newPrice) || 0
          }]
        })
      });
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalSales = sales.length;
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
  const totalTreesSold = sales.reduce((sum, sale) => 
    sum + sale.items.filter(item => item.tree && item.tree !== 'No Tree').length, 0
  );

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-xl">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Christmas Tree Manager</h1>
        </div>
      </nav>

      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`px-6 py-3 font-medium transition ${currentPage === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <BarChart3 className="inline mr-2" size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('stock')}
              className={`px-6 py-3 font-medium transition ${currentPage === 'stock' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <Package className="inline mr-2" size={18} />
              Stock
            </button>
            <button
              onClick={() => setCurrentPage('sales')}
              className={`px-6 py-3 font-medium transition ${currentPage === 'sales' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            >
              <ShoppingCart className="inline mr-2" size={18} />
              Sales
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Total Revenue</h3>
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">£{totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Total Sales</h3>
                  <ShoppingCart className="text-blue-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{totalSales}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Average Sale</h3>
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">£{averageSale.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">Trees Sold</h3>
                  <Package className="text-green-700" size={24} />
                </div>
                <p className="text-3xl font-bold text-gray-800">{totalTreesSold}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Low Stock Alerts</h3>
              <div className="space-y-2">
                {Object.entries(stock.trees).map(([treeType, treeSizes]) => 
                  Object.entries(treeSizes).map(([size, qty]) => 
                    qty < 5 && (
                      <div key={`${treeType}-${size}`} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-semibold text-red-800">
                          {treeType.charAt(0).toUpperCase() + treeType.slice(1)} - {size}
                        </span>
                        <span className="text-sm font-bold text-red-600">{qty} remaining</span>
                      </div>
                    )
                  )
                )}
                {Object.entries(stock.accessories).map(([accessory, qty]) => 
                  qty < 10 && (
                    <div key={accessory} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-semibold text-yellow-800">{accessoryNames[accessory]}</span>
                      <span className="text-sm font-bold text-yellow-600">{qty} remaining</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'stock' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Stock Management</h2>
              <button
                onClick={() => setShowAddStockModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <Plus size={20} />
                Add Stock
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trees - Current Stock</h3>
              {Object.entries(stock.trees).map(([treeType, treeSizes]) => (
                <div key={treeType} className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 capitalize">{treeType}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {sizes.map(size => (
                      <div key={size} className={`border-2 rounded-lg p-3 text-center ${
                        treeSizes[size] < 5 ? 'border-red-300 bg-red-50' :
                        treeSizes[size] < 10 ? 'border-yellow-300 bg-yellow-50' :
                        'border-gray-200 bg-white'
                      }`}>
                        <p className="text-xs font-semibold text-gray-600">{size}</p>
                        <p className="text-3xl font-bold text-gray-800">{treeSizes[size]}</p>
                        <p className="text-xs text-gray-500">£{prices.trees[treeType][size]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Accessories - Current Stock</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stock.accessories).map(([accessory, qty]) => (
                  <div key={accessory} className={`border-2 rounded-lg p-4 text-center ${
                    qty < 10 ? 'border-yellow-300 bg-yellow-50' :
                    qty < 20 ? 'border-blue-300 bg-blue-50' :
                    'border-gray-200 bg-white'
                  }`}>
                    <p className="text-sm font-semibold text-gray-700">{accessoryNames[accessory]}</p>
                    <p className="text-4xl font-bold text-gray-800">{qty}</p>
                    <p className="text-sm text-gray-500">£{prices.accessories[accessory]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Stock History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Item</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Quantity</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockHistory.map(entry => (
                      <tr key={entry.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            entry.type === 'delivery' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{entry.item}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-bold ${
                            entry.quantity > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {entry.quantity > 0 ? `+${entry.quantity}` : entry.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{entry.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pricing</h3>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Tree Prices by Type and Size</h4>
                {Object.entries(prices.trees).map(([treeType, treeSizes]) => (
                  <div key={treeType} className="mb-4">
                    <h5 className="text-md font-semibold text-gray-600 mb-2 capitalize">{treeType}</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                      {sizes.map(size => (
                        <div key={size}>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">{size}</label>
                          <div className="flex items-center">
                            <span className="text-sm mr-1">£</span>
                            <input
                              type="number"
                              step="0.01"
                              value={treeSizes[size]}
                              onChange={(e) => updateTreePrice(treeType, size, e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Accessory Prices</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(accessoryNames).map(([key, name]) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{name}</label>
                      <div className="flex items-center">
                        <span className="text-sm mr-1">£</span>
                        <input
                          type="number"
                          step="0.01"
                          value={prices.accessories[key]}
                          onChange={(e) => updateAccessoryPrice(key, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'sales' && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales History</h2>
            {sales.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                No sales recorded yet
              </div>
            ) : (
              <div className="space-y-4">
                {sales.map(sale => (
                  <div key={sale.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Sale #{sale.id}</h3>
                        <p className="text-sm text-gray-600">{new Date(sale.createdAt).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Payment: {sale.paymentMethod}</p>
                        {sale.email && <p className="text-sm text-gray-600">Email: {sale.email}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">£{sale.total.toFixed(2)}</p>
                        {sale.discount > 0 && (
                          <p className="text-sm text-green-700">{sale.discount}% discount applied</p>
                        )}
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      {sale.items.map((item, idx) => (
                        <div key={idx} className="mb-2 pb-2 border-b last:border-b-0">
                          <p className="font-semibold text-gray-800">
                            {item.tree} {item.size && `- ${item.size}`}
                          </p>
                          {item.metalStand > 0 && <p className="text-sm text-gray-600 ml-4">Metal Stand x{item.metalStand}</p>}
                          {item.plasticStand > 0 && <p className="text-sm text-gray-600 ml-4">Plastic Stand x{item.plasticStand}</p>}
                          {item.artificialWreath > 0 && <p className="text-sm text-gray-600 ml-4">Artificial Wreath x{item.artificialWreath}</p>}
                          {item.handmadeWreath > 0 && <p className="text-sm text-gray-600 ml-4">Handmade Wreath x{item.handmadeWreath}</p>}
                          {item.hollyWreath > 0 && <p className="text-sm text-gray-600 ml-4">Holly Wreath x{item.hollyWreath}</p>}
                          {item.smallReindeer > 0 && <p className="text-sm text-gray-600 ml-4">Small Reindeer x{item.smallReindeer}</p>}
                          {item.mediumReindeer > 0 && <p className="text-sm text-gray-600 ml-4">Medium Reindeer x{item.mediumReindeer}</p>}
                          {item.largeReindeer > 0 && <p className="text-sm text-gray-600 ml-4">Large Reindeer x{item.largeReindeer}</p>}
                          <p className="text-sm font-semibold text-gray-700 mt-1">£{item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showAddStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8 flex items-start justify-center">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl my-8">
              <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-3 md:py-4 flex justify-between items-center rounded-t-lg z-10">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">Add Stock</h2>
                <button
                  onClick={() => setShowAddStockModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 md:p-6">
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">Trees</h3>
                  {Object.entries(newStock.trees).map(([treeType, treeSizes]) => (
                    <div key={treeType} className="mb-4">
                      <h4 className="text-base md:text-lg font-semibold text-gray-700 mb-2 capitalize">{treeType}</h4>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {sizes.map(size => (
                          <div key={size}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">{size}</label>
                            <input
                              type="number"
                              min="0"
                              value={treeSizes[size]}
                              onChange={(e) => updateNewTreeStock(treeType, size, e.target.value)}
                              className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mb-6">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">Accessories</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(accessoryNames).map(([key, name]) => (
                      <div key={key}>
                        <label className="block text-xs md:text-sm font-semibold text-gray-600 mb-1">{name}</label>
                        <input
                          type="number"
                          min="0"
                          value={newStock.accessories[key]}
                          onChange={(e) => updateNewAccessoryStock(key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <button
                    onClick={handleAddStock}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition text-sm md:text-base"
                  >
                    Add Stock to Inventory
                  </button>
                  <button
                    onClick={() => setShowAddStockModal(false)}
                    className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition text-sm md:text-base"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;