// src/components/Main.jsx
import { faFilter, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const budgetOrder = ['Daily', 'Weekly', 'Monthly', 'Annually'];

const Main = () => {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // state hooks
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [txSortField, setTxSortField] = useState('date');
  const [txSortOrder, setTxSortOrder] = useState('desc');

  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [netTotal, setNetTotal] = useState(0);

  const [budgets, setBudgets] = useState([]);
  const [budgetForm, setBudgetForm] = useState({ spendingLimit: '', duration: 'Monthly' });

  const [formData, setFormData] = useState({
    amount: '',
    type: 'Expense',
    category: '',
    date: '',
    description: '',
  });

  const [showTxModal, setShowTxModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [editTxForm, setEditTxForm] = useState({
    amount: '', type: 'Expense', category: '', description: '', date: '',
  });

  const [showBudModal, setShowBudModal] = useState(false);
  const [editBudForm, setEditBudForm] = useState({ spendingLimit: '', duration: '' });

  // Redirect to signup/login if not authenticated
  const isAuthenticated = !!accessToken;

  // Fetch data
  const refreshData = async () => {
    try {
      const [tRes, bRes] = await Promise.all([
        axios.get('/api/transaction', {
          headers: { Authorization: `Bearer ${accessToken}` }
        }),
        axios.get('/api/budget', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      ]);
      const { incomeTransactions, expensesTransactions, Income, Expenses, total } = tRes.data;
      setTransactions([...expensesTransactions, ...incomeTransactions]);
      setIncomeTotal(Income);
      setExpenseTotal(Expenses);
      setNetTotal(total);
      setBudgets(Array.isArray(bRes.data) ? bRes.data : []);
    } catch (err) {
      if (err.response?.status === 401) navigate('/');
      else console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="container mt-5 text-center">
        <Link to="/signup" className="btn btn-success me-2">Sign Up</Link>
        <Link to="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    // navigate('/'); 
  };

  // Transaction handlers
  const handleTxChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTxSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, amount: Number(formData.amount) };
      if (!formData.date) delete payload.date;
      await axios.post('/api/transaction', payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setFormData({
        amount: '',
        type: 'Expense',
        category: '',
        date: '',
        description: ''
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTxDelete = async (id) => {
    try {
      await axios.delete(`/api/transaction/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const openTxModal = (tx) => {
    setEditTx(tx);
    setEditTxForm({
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      description: tx.description,
      date: tx.date.split('T')[0]
    });
    setShowTxModal(true);
  };

  const handleTxFormChange = (e) =>
    setEditTxForm({ ...editTxForm, [e.target.name]: e.target.value });

  const handleTxSave = async () => {
    try {
      const payload = { ...editTxForm, amount: Number(editTxForm.amount) };
      await axios.put(`/api/transaction/${editTx._id}`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShowTxModal(false);
      setEditTx(null);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Budget handlers
  const handleBudChange = (e) =>
    setBudgetForm({ ...budgetForm, [e.target.name]: e.target.value });

  const handleBudSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/budget', budgetForm, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setBudgetForm({ spendingLimit: '', duration: 'Monthly' });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBudDelete = async (duration) => {
    try {
      await axios.delete('/api/budget', {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { duration }
      });
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const openBudModal = (b) => {
    setEditBudForm({ spendingLimit: b.spendingLimit, duration: b.typeOfBudget });
    setShowBudModal(true);
  };

  const handleBudFormChange = (e) =>
    setEditBudForm({ ...editBudForm, [e.target.name]: e.target.value });

  const handleBudSave = async () => {
    try {
      await axios.put('/api/budget', editBudForm, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setShowBudModal(false);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering & sorting transactions
  const filteredTx = transactions.filter(
    (tx) => filterType === 'All' || tx.type === filterType
  );
  const sortedTx = [...filteredTx].sort((a, b) => {
    let aVal = txSortField === 'date' ? new Date(a.date) : a[txSortField];
    let bVal = txSortField === 'date' ? new Date(b.date) : b[txSortField];
    if (aVal < bVal) return txSortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return txSortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleTxSort = (field) => {
    if (txSortField === field) setTxSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else {
      setTxSortField(field);
      setTxSortOrder('asc');
    }
  };

  // Sorting budgets by defined order
  const sortedBudgets = budgets
    .filter((b) => budgetOrder.includes(b.typeOfBudget))
    .sort(
      (a, b) =>
        budgetOrder.indexOf(a.typeOfBudget) - budgetOrder.indexOf(b.typeOfBudget)
    );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
      <h2>Dashboard</h2>

      {/* Summary cards */}
      <div className="row mb-4">
        {[
          { label: 'Total Income', value: incomeTotal },
          { label: 'Total Expenses', value: expenseTotal },
          { label: 'Net Total', value: netTotal }
        ].map((stat) => (
          <div key={stat.label} className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5>{stat.label}</h5>
                <p>${stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Transactions */}
        <div className="col-md-8">
          <div className="d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faFilter} />
            <Form.Select
              size="sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ width: 'auto', marginLeft: '8px' }}
            >
              <option>All</option>
              <option>Expense</option>
              <option>Income</option>
            </Form.Select>
          </div>

          {/* Transaction form */}
          <form onSubmit={handleTxSubmit} className="row g-2 mb-3">
            <div className="col-2">
              <Form.Control
                name="amount"
                value={formData.amount}
                onChange={handleTxChange}
                type="number"
                placeholder="Amount"
                required
              />
            </div>
            <div className="col-2">
              <Form.Select name="type" value={formData.type} onChange={handleTxChange}>
                <option>Expense</option>
                <option>Income</option>
              </Form.Select>
            </div>
            <div className="col-2">
              <Form.Control
                name="category"
                value={formData.category}
                onChange={handleTxChange}
                placeholder="Category"
              />
            </div>
            <div className="col-2">
              <Form.Control
                name="date"
                value={formData.date}
                onChange={handleTxChange}
                type="date"
              />
            </div>
            <div className="col-3">
              <Form.Control
                name="description"
                value={formData.description}
                onChange={handleTxChange}
                placeholder="Description"
              />
            </div>
            <div className="col-1">
              <Button type="submit" className="w-100">Add</Button>
            </div>
          </form>

          {/* Transaction table */}
          <table className="table table-striped">
            <thead>
              <tr>
                {['date','type','amount','category','description'].map((col) => (
                  <th
                    key={col}
                    onClick={() => toggleTxSort(col)}
                    style={{ cursor: 'pointer' }}
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}{' '}
                    <FontAwesomeIcon
                      icon={
                        txSortField === col
                          ? (txSortOrder === 'asc' ? faSortUp : faSortDown)
                          : faSort
                      }
                    />
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTx.map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.type}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.category}</td>
                  <td>{tx.description}</td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => openTxModal(tx)}
                      className="me-1"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleTxDelete(tx._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Budgets */}
        <div className="col-md-4">
          <h4>Budgets</h4>
          <form onSubmit={handleBudSubmit} className="mb-3">
            <Form.Control
              name="spendingLimit"
              type="number"
              placeholder="Limit"
              className="mb-2"
              value={budgetForm.spendingLimit}
              onChange={handleBudChange}
              required
            />
            <Form.Select
              name="duration"
              className="mb-2"
              value={budgetForm.duration}
              onChange={handleBudChange}
            >
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Annually</option>
            </Form.Select>
            <Button type="submit" className="w-100">Add</Button>
          </form>

          {sortedBudgets.length > 0 ? (
            sortedBudgets.map((b) => {
              const spent = b.spendingLimit - b.remainingMoney;
              return (
                <div key={b.typeOfBudget} className="card mb-2">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">
                        {[b.typeOfBudget]}
                      </h5>
                      <div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => openBudModal(b)}
                          className="me-1"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleBudDelete(b.typeOfBudget)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="mb-1">Limit: ${b.spendingLimit}</p>
                    <p className="mb-1">Spent: ${spent}</p>
                    <p className="mb-1">Remaining: ${b.remainingMoney}</p>
                    <p className="mb-1">
                      Status: {b.onTrack ? 'On Track' : 'Over Budget'}
                    </p>
                    <small>
                      {new Date(b.startDate).toLocaleDateString()} —{' '}
                      {new Date(b.endDate).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted">No budgets set yet.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal show={showTxModal} onHide={() => setShowTxModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={editTxForm.type}
                onChange={handleTxFormChange}
              >
                <option>Expense</option>
                <option>Income</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                name="amount"
                type="number"
                value={editTxForm.amount}
                onChange={handleTxFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={editTxForm.category}
                onChange={handleTxFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={editTxForm.description}
                onChange={handleTxFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                name="date"
                type="date"
                value={editTxForm.date}
                onChange={handleTxFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTxModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleTxSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showBudModal} onHide={() => setShowBudModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Spending Limit</Form.Label>
              <Form.Control
                name="spendingLimit"
                type="number"
                value={editBudForm.spendingLimit}
                onChange={handleBudFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Select
                name="duration"
                value={editBudForm.duration}
                onChange={handleBudFormChange}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Annually</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBudModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBudSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Main;
