import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, DollarSign, BarChart3, RefreshCw, Clock, Info, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchInvestmentData, saveInvestmentData } from '../../services/studentService';
import { logActivity } from '../../services/activityService';
import { toast } from 'react-toastify';

const InvestmentSimulator = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
    investments: [],
    history: []
  });
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [stocks, setStocks] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load investment data and generate stocks
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Generate mock stocks with random initial prices
        const mockStocks = [
          { id: 1, symbol: 'TECH', name: 'TechCorp', sector: 'Technology', volatility: 0.05 },
          { id: 2, symbol: 'FNCE', name: 'FinanceHub', sector: 'Finance', volatility: 0.03 },
          { id: 3, symbol: 'HLTH', name: 'HealthPlus', sector: 'Healthcare', volatility: 0.04 },
          { id: 4, symbol: 'ENRG', name: 'EnergyNow', sector: 'Energy', volatility: 0.06 },
          { id: 5, symbol: 'CONS', name: 'ConsumerGoods', sector: 'Consumer', volatility: 0.02 },
          { id: 6, symbol: 'MANF', name: 'Manufacturing Inc', sector: 'Industrial', volatility: 0.04 },
          { id: 7, symbol: 'RETL', name: 'RetailGiant', sector: 'Retail', volatility: 0.03 },
          { id: 8, symbol: 'FOOD', name: 'FoodServices', sector: 'Food', volatility: 0.02 },
        ];

        const stocksWithPrices = mockStocks.map(stock => ({
          ...stock,
          price: parseFloat((Math.random() * 100 + 20).toFixed(2)),
          history: []
        }));

        setStocks(stocksWithPrices);
        
        // Load saved investment data
        const data = await fetchInvestmentData();
        if (data) {
          setPortfolio({
            cash: data.cash || 10000,
            investments: data.investments || [],
            history: data.history || []
          });
          if (data.currentDay) setCurrentDay(data.currentDay);
        }
        
        // Log page view activity
        logActivity({
          activityType: "page_view",
          description: "Viewed investment simulator",
          metadata: {
            page: "/student/investment-simulator",
            timestamp: new Date().toISOString()
          },
          pageUrl: window.location.pathname
        });
      } catch (error) {
        console.error('Error loading investment data:', error);
        toast.error('Failed to load investment data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update stock prices daily
  const simulateMarketDay = () => {
    if (currentDay >= 30) {
      alert('Simulation complete! You\'ve reached the 30-day limit.');
      return;
    }
    
    // Log market simulation activity
    logActivity({
      activityType: "financial_action",
      description: "Simulated market day in investment simulator",
      metadata: {
        action: "simulate_market_day",
        day: currentDay,
        portfolioValue: totalPortfolioValue,
        timestamp: new Date().toISOString()
      },
      pageUrl: window.location.pathname
    });

    // Update stock prices with random fluctuations based on volatility
    const updatedStocks = stocks.map(stock => {
      const change = (Math.random() - 0.5) * 2 * stock.volatility * stock.price;
      const newPrice = Math.max(1, parseFloat((stock.price + change).toFixed(2)));
      
      return {
        ...stock,
        previousPrice: stock.price,
        price: newPrice,
        percentChange: parseFloat(((newPrice - stock.price) / stock.price * 100).toFixed(2)),
        history: [...stock.history, { day: currentDay, price: stock.price }]
      };
    });

    // Update portfolio value
    const portfolioValue = portfolio.investments.reduce((total, investment) => {
      const stock = updatedStocks.find(s => s.id === investment.stockId);
      return total + (stock.price * investment.shares);
    }, 0);

    // Add to portfolio history
    const updatedPortfolio = {
      ...portfolio,
      history: [...portfolio.history, {
        day: currentDay,
        cash: portfolio.cash,
        investments: portfolioValue,
        total: portfolio.cash + portfolioValue
      }]
    };

    setStocks(updatedStocks);
    setPortfolio(updatedPortfolio);
    setCurrentDay(currentDay + 1);
  };

  const buyStock = () => {
    if (!selectedStock) return;
    
    const stock = stocks.find(s => s.id === selectedStock);
    const totalCost = stock.price * quantity;
    
    if (totalCost > portfolio.cash) {
      alert('Not enough cash for this purchase!');
      return;
    }
    
    // Log buy stock activity
    logActivity({
      activityType: "financial_action",
      description: "Bought stock in investment simulator",
      metadata: {
        action: "buy_stock",
        stockSymbol: stock.symbol,
        stockName: stock.name,
        quantity: quantity,
        pricePerShare: stock.price,
        totalCost: totalCost,
        timestamp: new Date().toISOString()
      },
      pageUrl: window.location.pathname
    });
    
    // Check if already own this stock
    const existingInvestment = portfolio.investments.find(inv => inv.stockId === selectedStock);
    
    let updatedInvestments;
    if (existingInvestment) {
      // Update existing investment
      updatedInvestments = portfolio.investments.map(inv => 
        inv.stockId === selectedStock 
          ? { ...inv, shares: inv.shares + quantity, averagePrice: (inv.averagePrice * inv.shares + totalCost) / (inv.shares + quantity) }
          : inv
      );
    } else {
      // Add new investment
      updatedInvestments = [
        ...portfolio.investments,
        {
          stockId: selectedStock,
          symbol: stock.symbol,
          shares: quantity,
          purchasePrice: stock.price,
          averagePrice: stock.price
        }
      ];
    }
    
    setPortfolio({
      ...portfolio,
      cash: portfolio.cash - totalCost,
      investments: updatedInvestments
    });
    
    setQuantity(1);
  };
  
  const sellStock = (investmentIndex) => {
    const investment = portfolio.investments[investmentIndex];
    const stock = stocks.find(s => s.id === investment.stockId);
    const saleValue = stock.price * investment.shares;
    
    const updatedInvestments = portfolio.investments.filter((_, index) => index !== investmentIndex);
    
    // Log sell stock activity
    logActivity({
      activityType: "financial_action",
      description: "Sold stock in investment simulator",
      metadata: {
        action: "sell_stock",
        stockSymbol: investment.symbol,
        stockId: investment.stockId,
        shares: investment.shares,
        pricePerShare: stock.price,
        totalValue: saleValue,
        profit: saleValue - (investment.averagePrice * investment.shares),
        timestamp: new Date().toISOString()
      },
      pageUrl: window.location.pathname
    });
    
    setPortfolio({
      ...portfolio,
      cash: portfolio.cash + saleValue,
      investments: updatedInvestments
    });
  };

  const totalPortfolioValue = portfolio.cash + portfolio.investments.reduce((total, investment) => {
    const stock = stocks.find(s => s.id === investment.stockId);
    return total + (stock ? stock.price * investment.shares : 0);
  }, 0);

  const getPerformanceColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Save investment data
  const saveInvestmentState = async () => {
    try {
      await saveInvestmentData({
        cash: portfolio.cash,
        investments: portfolio.investments,
        history: portfolio.history,
        currentDay: currentDay
      });
      
      // Log save investment activity
      logActivity({
        activityType: "financial_action",
        description: "Saved investment portfolio",
        metadata: {
          action: "save_investment",
          cash: portfolio.cash,
          investmentCount: portfolio.investments.length,
          totalPortfolioValue: totalPortfolioValue,
          currentDay: currentDay,
          timestamp: new Date().toISOString()
        },
        pageUrl: window.location.pathname
      });
      
      toast.success('Investment data saved successfully!');
    } catch (error) {
      console.error('Error saving investment data:', error);
      toast.error('Failed to save investment data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 sm:p-6 lg:p-8">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button 
            onClick={() => navigate('/student/dashboard')} 
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Investment Simulator</h1>
              <p className="text-lg text-gray-600">Practice investing with virtual money</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-xl shadow-md p-4 flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Day</p>
                  <p className="text-xl font-bold">{currentDay} / 30</p>
                </div>
              </div>
              
              <button
                onClick={simulateMarketDay}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Next Day
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Portfolio Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                Portfolio Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Cash Available:</span>
                  <span className="font-semibold">${portfolio.cash.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Investments Value:</span>
                  <span className="font-semibold">
                    ${portfolio.investments.reduce((total, investment) => {
                      const stock = stocks.find(s => s.id === investment.stockId);
                      return total + (stock ? stock.price * investment.shares : 0);
                    }, 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-800 font-medium">Total Portfolio Value:</span>
                  <span className="text-xl font-bold text-purple-600">${totalPortfolioValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Your Investments */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Your Investments
              </h2>
              
              {portfolio.investments.length > 0 ? (
                <div className="space-y-4">
                  {portfolio.investments.map((investment, index) => {
                    const stock = stocks.find(s => s.id === investment.stockId);
                    if (!stock) return null;
                    
                    const currentValue = stock.price * investment.shares;
                    const profit = currentValue - (investment.averagePrice * investment.shares);
                    const profitPercentage = (profit / (investment.averagePrice * investment.shares)) * 100;
                    
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-bold text-gray-800">{stock.symbol}</span>
                            <span className="text-gray-500 text-sm ml-2">{stock.name}</span>
                          </div>
                          <button
                            onClick={() => sellStock(index)}
                            className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                          >
                            Sell All
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Shares</p>
                            <p className="font-medium">{investment.shares}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Current Price</p>
                            <p className="font-medium">${stock.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Avg. Purchase Price</p>
                            <p className="font-medium">${investment.averagePrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Current Value</p>
                            <p className="font-medium">${currentValue.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Profit/Loss:</span>
                            <span className={`font-semibold ${getPerformanceColor(profit)}`}>
                              ${profit.toFixed(2)} ({profitPercentage.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>You don't have any investments yet.</p>
                  <p className="mt-2 text-sm">Buy stocks to start building your portfolio!</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Market Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Stock Market
                </h2>
                
                <button 
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-purple-600 hover:text-purple-800 flex items-center text-sm"
                >
                  <Info className="w-4 h-4 mr-1" />
                  {showInfo ? 'Hide Info' : 'How It Works'}
                </button>
              </div>
              
              {showInfo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-100"
                >
                  <h3 className="font-bold text-purple-800 mb-2">How the Simulator Works</h3>
                  <ul className="space-y-2 text-sm text-purple-900">
                    <li>• You start with $10,000 virtual cash to invest</li>
                    <li>• Stock prices change each day based on market simulation</li>
                    <li>• Buy stocks when prices are low, sell when they're high</li>
                    <li>• The simulation runs for 30 days</li>
                    <li>• Your goal is to maximize your portfolio value</li>
                  </ul>
                </motion.div>
              )}
              
              {/* Buy Stock Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-md font-semibold mb-3">Buy Stocks</h3>
                <div className="flex flex-wrap gap-3">
                  <select
                    className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded"
                    value={selectedStock || ''}
                    onChange={(e) => setSelectedStock(parseInt(e.target.value))}
                  >
                    <option value="">Select a stock</option>
                    {stocks.map(stock => (
                      <option key={stock.id} value={stock.id}>
                        {stock.symbol} - {stock.name} (${stock.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    min="1"
                    placeholder="Quantity"
                    className="w-32 p-2 border border-gray-300 rounded"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  
                  <button
                    onClick={buyStock}
                    disabled={!selectedStock}
                    className={`px-4 py-2 rounded font-medium ${!selectedStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                  >
                    Buy
                  </button>
                </div>
                
                {selectedStock && (
                  <div className="mt-3 text-sm text-gray-600">
                    Total Cost: ${(stocks.find(s => s.id === selectedStock)?.price * quantity).toFixed(2)}
                  </div>
                )}
              </div>
              
              {/* Stock Market Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Symbol</th>
                      <th className="py-3 px-6 text-left">Company</th>
                      <th className="py-3 px-6 text-left">Sector</th>
                      <th className="py-3 px-6 text-right">Price</th>
                      <th className="py-3 px-6 text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {stocks.map(stock => {
                      const priceChange = stock.previousPrice ? stock.price - stock.previousPrice : 0;
                      const percentChange = stock.previousPrice ? (priceChange / stock.previousPrice) * 100 : 0;
                      
                      return (
                        <tr key={stock.id} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedStock(stock.id)}>
                          <td className="py-3 px-6 text-left font-medium">{stock.symbol}</td>
                          <td className="py-3 px-6 text-left">{stock.name}</td>
                          <td className="py-3 px-6 text-left">{stock.sector}</td>
                          <td className="py-3 px-6 text-right font-medium">${stock.price.toFixed(2)}</td>
                          <td className={`py-3 px-6 text-right ${getPerformanceColor(priceChange)}`}>
                            {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 flex justify-end"
        >
          <button
            onClick={saveInvestmentState}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Progress
          </button>
        </motion.div>
      </div>
      )}
    </div>
  );
};

export default InvestmentSimulator;