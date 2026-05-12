import { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const meals = ["breakfast", "lunch", "snacks", "dinner"];
const mealLabels = { breakfast: "?? Breakfast", lunch: "??? Lunch", snacks: "? Evening Snacks", dinner: "?? Dinner" };

const StudentMessMenu = () => {
  const [menu, setMenu] = useState({ week: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("Monday");

  useEffect(() => {
    fetchMessMenu();
    const interval = setInterval(fetchMessMenu, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessMenu = async () => {
    try {
      const response = await fetch("http://localhost:3001/student/mess-menu", {
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

  const getCurrentDayMenu = () => {
    return menu.week?.find(d => d.day === selectedDay);
  };

  if (loading) return <div style={styles.container}><p>Loading mess menu...</p></div>;

  const currentDay = getCurrentDayMenu();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>??? Weekly Mess Menu</h2>
          <p style={styles.description}>Browse your weekly mess menu with breakfast, lunch, snacks, and dinner items</p>
        </div>
        <button onClick={fetchMessMenu} style={styles.refreshBtn}><IoMdRefresh />  Refresh</button>
      </div>

      <div style={styles.daySelector}>
        {dayOrder.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              ...styles.dayBtn,
              ...(selectedDay === day ? styles.activeDayBtn : {})
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {currentDay && (
        <div style={styles.mealGrid}>
          {meals.map(mealType => {
            const items = currentDay[mealType] || [];
            return (
              <div key={mealType} style={styles.mealCard}>
                <h3 style={styles.mealTitle}>{mealLabels[mealType]}</h3>
                {items.length === 0 ? (
                  <p style={styles.emptyText}>No items scheduled</p>
                ) : (
                  <div style={styles.itemsList}>
                    {items.map(item => (
                      <div key={item.id} style={styles.itemContainer}>
                        <div style={styles.itemInfo}>
                          <div style={styles.itemName}>{item.name}</div>
                          {item.description && <div style={styles.itemDesc}>{item.description}</div>}
                        </div>
                        <span style={{
                          ...styles.itemBadge,
                          backgroundColor: item.type === "Veg" ? "#dcfce7" : "#fee2e2",
                          color: item.type === "Veg" ? "#166534" : "#991b1b"
                        }}>
                          {item.type === "Veg" ? "??" : "??"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "32px",
    minHeight: "calc(100vh - 140px)",
    backgroundColor: "#eef2ff",
    color: "#0f172a"
  },
  header: {
    marginBottom: "32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "bold"
  },
  description: {
    marginTop: "12px",
    fontSize: "16px",
    color: "#475569",
    maxWidth: "760px",
    lineHeight: 1.7
  },
  refreshBtn: {
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background-color 0.2s ease",
  },
  daySelector: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "8px",
    marginBottom: "32px"
  },
  dayBtn: {
    padding: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#475569",
    transition: "all 0.2s ease"
  },
  activeDayBtn: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
    color: "#ffffff"
  },
  mealGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px"
  },
  mealCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e2e8f0"
  },
  mealTitle: {
    margin: "0 0 16px 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827"
  },
  itemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  itemContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb"
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827"
  },
  itemDesc: {
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "4px"
  },
  itemBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    fontSize: "16px",
    flexShrink: 0,
    marginLeft: "8px"
  },
  emptyText: {
    color: "#9ca3af",
    fontStyle: "italic",
    textAlign: "center",
    padding: "20px"
  }
};

export default StudentMessMenu;
