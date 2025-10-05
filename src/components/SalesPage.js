import React, { useState } from 'react';
import { ShoppingCart, X, ChevronDown, ChevronUp } from 'lucide-react';

const App = () => {
  const [selectedTree, setSelectedTree] = useState('No Tree');
  const [selectedSize, setSelectedSize] = useState('');
  const [showDiscountSection, setShowDiscountSection] = useState(false);
  
  // Accessories
  const [metalStand, setMetalStand] = useState(0);
  const [plasticStand, setPlasticStand] = useState(0);
  const [artificialWreath, setArtificialWreath] = useState(0);
  const [handmadeWreath, setHandmadeWreath] = useState(0);
  const [hollyWreath, setHollyWreath] = useState(0);
  const [smallReindeer, setSmallReindeer] = useState(0);
  const [mediumReindeer, setMediumReindeer] = useState(0);
  const [largeReindeer, setLargeReindeer] = useState(0);
  
  const [saleItems, setSaleItems] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [email, setEmail] = useState('');

  const treeTypes = ['Nordmann', 'Fraser', 'Spruce', 'Pot', 'No Tree'];
  const sizes = ['2ft', '3ft', '4ft', '5ft', '6ft', '7ft', '8ft', '9ft+'];

  const calculateItemPrice = (tree, size, accessories) => {
    let total = 0;
    
    // Tree pricing
    if (tree && tree !== 'No Tree' && size) {
      const sizeMultiplier = {
        '2ft': 20, '3ft': 30, '4ft': 40, '5ft': 50,
        '6ft': 60, '7ft': 70, '8ft': 80, '9ft+': 100
      };
      total += sizeMultiplier[size] || 0;
    }
    
    // Accessories pricing
    total += accessories.metalStand * 15;
    total += accessories.plasticStand * 8;
    total += accessories.artificialWreath * 12;
    total += accessories.handmadeWreath * 25;
    total += accessories.hollyWreath * 18;
    total += accessories.smallReindeer * 5;
    total += accessories.mediumReindeer * 10;
    total += accessories.largeReindeer * 15;
    
    return total;
  };

  const calculateTotal = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + item.price, 0);
    const discounted = subtotal * (1 - selectedDiscount / 100);
    return discounted;
  };

  const handleTreeSelect = (tree) => {
    setSelectedTree(tree);
    if (tree === 'No Tree') {
      setSelectedSize('');
    }
  };

  const addToSale = () => {
    if (!selectedTree) {
      alert('Please select a tree type');
      return;
    }
    if (selectedTree !== 'No Tree' && !selectedSize) {
      alert('Please select a tree size');
      return;
    }

    const accessories = {
      metalStand,
      plasticStand,
      artificialWreath,
      handmadeWreath,
      hollyWreath,
      smallReindeer,
      mediumReindeer,
      largeReindeer
    };

    const hasAccessories = Object.values(accessories).some(qty => qty > 0);

    if (!selectedTree || (selectedTree === 'No Tree' && !hasAccessories)) {
      alert('Please select items to add');
      return;
    }

    const itemPrice = calculateItemPrice(selectedTree, selectedSize, accessories);

    const newItem = {
      id: Date.now(),
      tree: selectedTree,
      size: selectedSize,
      accessories: {...accessories},
      price: itemPrice
    };

    setSaleItems([...saleItems, newItem]);
    clearCurrentSelection();
  };

  const clearCurrentSelection = () => {
    setSelectedTree('');
    setSelectedSize('');
    setMetalStand(0);
    setPlasticStand(0);
    setArtificialWreath(0);
    setHandmadeWreath(0);
    setHollyWreath(0);
    setSmallReindeer(0);
    setMediumReindeer(0);
    setLargeReindeer(0);
  };

  const removeFromSale = (id) => {
    setSaleItems(saleItems.filter(item => item.id !== id));
  };

  const resetForm = () => {
    clearCurrentSelection();
    setSaleItems([]);
    setSelectedDiscount(0);
    setPaymentMethod('');
    setEmail('');
    setShowDiscountSection(false);
  };

  const handleDiscountClick = (percent) => {
    setSelectedDiscount(percent);
  };

  const handleSubmit = async () => {
    if (saleItems.length === 0) {
      alert('Please add items to the sale');
      return;
    }
    if (!paymentMethod) {
      alert('Please select payment method');
      return;
    }
    
    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: saleItems,
          total: calculateTotal(),
          discount: selectedDiscount,
          paymentMethod,
          email
        })
      });

      if (response.ok) {
        alert(`Sale completed! Total: £${calculateTotal().toFixed(2)}`);
        resetForm();
      } else {
        alert('Error saving sale');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const formatAccessories = (accessories) => {
    const items = [];
    if (accessories.metalStand > 0) items.push(`Metal Stand x${accessories.metalStand}`);
    if (accessories.plasticStand > 0) items.push(`Plastic Stand x${accessories.plasticStand}`);
    if (accessories.artificialWreath > 0) items.push(`Artificial Wreath x${accessories.artificialWreath}`);
    if (accessories.handmadeWreath > 0) items.push(`Handmade Wreath x${accessories.handmadeWreath}`);
    if (accessories.hollyWreath > 0) items.push(`Holly Wreath x${accessories.hollyWreath}`);
    if (accessories.smallReindeer > 0) items.push(`Small Reindeer x${accessories.smallReindeer}`);
    if (accessories.mediumReindeer > 0) items.push(`Medium Reindeer x${accessories.mediumReindeer}`);
    if (accessories.largeReindeer > 0) items.push(`Large Reindeer x${accessories.largeReindeer}`);
    return items;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-red-600 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Left side - Item Selection */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart size={28} className="text-green-700" />
              <h1 className="text-2xl font-bold text-gray-800">Add Items</h1>
            </div>

            {/* Tree Type Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Tree Type</h2>
              <div className="flex flex-wrap gap-2">
                {treeTypes.map(tree => (
                  <button
                    key={tree}
                    onClick={() => handleTreeSelect(tree)}
                    className={`px-5 py-2 rounded-lg font-semibold transition ${
                      selectedTree === tree
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tree}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Select Size</h2>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!selectedTree || selectedTree === 'No Tree'}
                    className={`px-5 py-2 rounded-lg font-semibold transition ${
                      selectedSize === size
                        ? 'bg-green-600 text-white'
                        : (!selectedTree || selectedTree === 'No Tree')
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">Accessories</h2>
              
              {/* Stands */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Stands</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Metal</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMetalStand(Math.max(0, metalStand - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{metalStand}</span>
                      <button
                        type="button"
                        onClick={() => setMetalStand(metalStand + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Plastic</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPlasticStand(Math.max(0, plasticStand - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{plasticStand}</span>
                      <button
                        type="button"
                        onClick={() => setPlasticStand(plasticStand + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wreaths */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Wreaths</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Artificial</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setArtificialWreath(Math.max(0, artificialWreath - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{artificialWreath}</span>
                      <button
                        type="button"
                        onClick={() => setArtificialWreath(artificialWreath + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Handmade</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHandmadeWreath(Math.max(0, handmadeWreath - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{handmadeWreath}</span>
                      <button
                        type="button"
                        onClick={() => setHandmadeWreath(handmadeWreath + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Holly</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setHollyWreath(Math.max(0, hollyWreath - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{hollyWreath}</span>
                      <button
                        type="button"
                        onClick={() => setHollyWreath(hollyWreath + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reindeer */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2 text-sm">Reindeer</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Small</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSmallReindeer(Math.max(0, smallReindeer - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{smallReindeer}</span>
                      <button
                        type="button"
                        onClick={() => setSmallReindeer(smallReindeer + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Medium</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMediumReindeer(Math.max(0, mediumReindeer - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{mediumReindeer}</span>
                      <button
                        type="button"
                        onClick={() => setMediumReindeer(mediumReindeer + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Large</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setLargeReindeer(Math.max(0, largeReindeer - 1))}
                        className="w-10 h-10 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-lg font-semibold text-gray-800">{largeReindeer}</span>
                      <button
                        type="button"
                        onClick={() => setLargeReindeer(largeReindeer + 1)}
                        className="w-10 h-10 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={addToSale}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Add to Sale
            </button>
          </div>

          {/* Right side - Sale Summary */}
          <div className="bg-white rounded-lg shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Sale</h2>
            
            {/* Items List */}
            <div className="mb-6 space-y-3 max-h-96 overflow-y-auto">
              {saleItems.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No items added yet</p>
              ) : (
                saleItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded-lg relative">
                    <button
                      onClick={() => removeFromSale(item.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                    <div className="pr-6">
                      <p className="font-semibold text-gray-800">
                        {item.tree} {item.size && `- ${item.size}`}
                      </p>
                      {formatAccessories(item.accessories).map((acc, idx) => (
                        <p key={idx} className="text-xs text-gray-600">{acc}</p>
                      ))}
                      <p className="text-sm font-bold text-green-600 mt-1">£{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal */}
            {saleItems.length > 0 && (
              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-semibold text-gray-800 mb-2">
                  <span>Subtotal:</span>
                  <span>£{saleItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Collapsible Discount Section */}
            <div className="mb-4">
              <button
                onClick={() => setShowDiscountSection(!showDiscountSection)}
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">
                  {selectedDiscount > 0 ? `Discount: ${selectedDiscount}%` : 'Apply Discount'}
                </span>
                {showDiscountSection ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              
              {showDiscountSection && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleDiscountClick(0)}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition ${
                        selectedDiscount === 0
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      0%
                    </button>
                    <button
                      onClick={() => handleDiscountClick(5)}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition ${
                        selectedDiscount === 5
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      5%
                    </button>
                    <button
                      onClick={() => handleDiscountClick(10)}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition ${
                        selectedDiscount === 10
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      10%
                    </button>
                    <button
                      onClick={() => handleDiscountClick(15)}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition ${
                        selectedDiscount === 15
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      15%
                    </button>
                    <button
                      onClick={() => handleDiscountClick(20)}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition ${
                        selectedDiscount === 20
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      20%
                    </button>
                    <button
                      onClick={() => handleDiscountClick(25)}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition ${
                        selectedDiscount === 25
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      25%
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Total */}
            {saleItems.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-green-600">£{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('Cash')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    paymentMethod === 'Cash'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('Card')}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    paymentMethod === 'Card'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Card
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-xs font-normal text-gray-500">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm text-gray-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
              >
                Complete Sale
              </button>
              <button
                onClick={resetForm}
                className="w-full px-6 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;