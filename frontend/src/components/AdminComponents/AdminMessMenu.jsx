import { useEffect, useState } from "react";

const AdminMessMenu = () => {
  const [menu, setMenu] = useState({ week: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedMeal, setSelectedMeal] = useState("breakfast");
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("Veg");
  const [itemDescription, setItemDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const meals = ["breakfast", "lunch", "snacks", "dinner"];
  const mealLabels = { breakfast: "Breakfast", lunch: "Lunch", snacks: "Evening Snacks", dinner: "Dinner" };

  useEffect(() => {
    fetchMessMenu();
  }, []);

  const fetchMessMenu = async () => {
    try {
      const response = await fetch("https://hostelhub-8wba.onrender.com/admin/mess-menu", {
        credentials: "include"
      });
      const data = await response.json();
      setMenu(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching mess menu:", error);
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setMessage("Item name is required");
      return;
    }

    try {
      const url = editingId
        ? `https://hostelhub-8wba.onrender.com/admin/mess-menu/${selectedDay}/${selectedMeal}/${editingId}`
        : "https://hostelhub-8wba.onrender.com/admin/mess-menu";

      const method = editingId ? "PUT" : "POST";
      const payload = editingId
        ? { name: itemName, type: itemType, description: itemDescription }
        : { day: selectedDay, mealType: selectedMeal, item: { name: itemName, type: itemType, description: itemDescription } };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setMenu(data.menu);
        setMessage(editingId ? "Item updated!" : "Item added!");
        resetForm();
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error saving item");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const response = await fetch(
        `https://hostelhub-8wba.onrender.com/admin/mess-menu/${selectedDay}/${selectedMeal}/${itemId}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMenu(data.menu);
        setMessage("Item deleted!");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error deleting item");
    }
  };

  const handleEdit = (item) => {
    setItemName(item.name);
    setItemType(item.type);
    setItemDescription(item.description);
    setEditingId(item.id);
  };

  const resetForm = () => {
    setItemName("");
    setItemType("Veg");
    setItemDescription("");
    setEditingId(null);
  };

  const getCurrentMealItems = () => {
    const dayData = menu?.week?.find(d => d.day === selectedDay);
    return dayData ? dayData[selectedMeal] || [] : [];
  };

  if (loading) return <div style={styles.container}><p>Loading...</p></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>??? Mess Menu Management</h2>
        <p style={styles.subtitle}>Manage breakfast, lunch, snacks, and dinner for all days</p>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.formCard}>
          <h3 style={styles.cardTitle}>{editingId ? "?? Edit Item" : "? Add New Item"}</h3>

          <form onSubmit={handleAddItem} style={styles.form}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  style={styles.select}
                >
                  {dayOrder.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Meal</label>
                <select
                  value={selectedMeal}
                  onChange={(e) => setSelectedMeal(e.target.value)}
                  style={styles.select}
                >
                  {meals.map(meal => <option key={meal} value={meal}>{mealLabels[meal]}</option>)}
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Item Name *</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Butter Naan, Sambar"
                style={styles.input}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type</label>
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                  style={styles.select}
                >
                  <option value="Veg">?? Veg</option>
                  <option value="Non-Veg">?? Non-Veg</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description (Optional)</label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Additional details or notes"
                rows="3"
                style={styles.textarea}
              />
            </div>

            {message && <p style={styles.message}>{message}</p>}

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.primaryBtn}>
                {editingId ? "Update Item" : "Add Item"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={styles.secondaryBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.menuCard}>
          <h3 style={styles.cardTitle}>?? {selectedDay} Menu</h3>

          <div style={styles.mealTabs}>
            {meals.map(meal => (
              <button
                key={meal}
                onClick={() => { setSelectedMeal(meal); resetForm(); }}
                style={{
                  ...styles.tab,
                  ...(selectedMeal === meal ? styles.activeTab : {})
                }}
              >
                {mealLabels[meal]}
              </button>
            ))}
          </div>

          <div style={styles.mealItems}>
            <h4 style={styles.mealTitle}>{mealLabels[selectedMeal]}</h4>
            {getCurrentMealItems().length === 0 ? (
              <p style={styles.emptyText}>No items added for this meal</p>
            ) : (
              getCurrentMealItems().map(item => (
                <div key={item.id} style={styles.itemCard}>
                  <div style={styles.itemContent}>
                    <div style={styles.itemName}>{item.name}</div>
                    {item.description && <div style={styles.itemDesc}>{item.description}</div>}
                    <span style={{
                      ...styles.badge,
                      backgroundColor: item.type === "Veg" ? "#dcfce7" : "#fee2e2",
                      color: item.type === "Veg" ? "#166534" : "#991b1b"
                    }}>
                      {item.type === "Veg" ? "??" : "??"} {item.type}
                    </span>
                  </div>
                  <div style={styles.itemActions}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={styles.editBtn}
                    >
                      ??
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={styles.deleteBtn}
                    >
                      ???
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "32px",
    minHeight: "calc(100vh - 100px)",
    backgroundColor: "#eef2ff",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  },
  mainContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  },
  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 20px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    fontFamily: "inherit",
  },
  textarea: {
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
  },
  message: {
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#dbeafe",
    color: "#0c4a6e",
    fontSize: "14px",
    margin: "0",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  primaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    flex: 1,
  },
  secondaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  mealTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "8px",
    marginBottom: "20px",
  },
  tab: {
    padding: "10px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    color: "#6b7280",
    transition: "all 0.2s ease",
  },
  activeTab: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    color: "#ffffff",
  },
  mealTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "12px",
    margin: 0,
  },
  mealItems: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  itemCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  },
  itemDesc: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "500",
    marginTop: "6px",
  },
  itemActions: {
    display: "flex",
    gap: "8px",
  },
  editBtn: {
    padding: "6px 10px",
    backgroundColor: "#fef3c7",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  deleteBtn: {
    padding: "6px 10px",
    backgroundColor: "#fee2e2",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  emptyText: {
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    padding: "20px",
  },
};

export default AdminMessMenu;
