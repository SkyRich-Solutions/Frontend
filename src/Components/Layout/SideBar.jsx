
import {
  BarChart2,
  TrendingUp,
  MapPinIcon,
  CloudUploadIcon,
  NotepadTextIcon,
  PackageIcon,
  PackageCheckIcon,
  WindIcon,
  BarChartIcon as ChartNoAxesCombined,
  TriangleAlertIcon,
} from "lucide-react"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router"
import logo from "../Layout/assets/logo.jpeg"

const SIDEBAR_ITEMS = [
  {
    name: "Warnings",
    icon: TriangleAlertIcon,
    color: "#FF4500",
    href: "/",
  },
  {
    name: "Overview of Compliance",
    icon: BarChart2, // Represents analytics overview
    color: "#9966FF",
    href: "/DataOverviewOfComplianceDashboard",
  },
  {
    name: "Map Overview",
    icon: MapPinIcon,
    color: "#36A2EB",
    href: "/map",
  },
  {
    name: "Material Component Overview",
    icon: PackageIcon, // Suits materials/components
    color: "#FFCE56",
    href: "/MaterialComponentOverviewDashboard",
  },
  {
    name: "Turbine Design Overview",
    icon: WindIcon, // Matches turbines
    color: "#FF6384",
    href: "/turbineDashboard",
  },
  {
    name: "Material Component Predictions",
    icon: TrendingUp, // For predictions/trends
    color: "#4BC04B",
    href: "/MaterialComponentPredictionsDashboard",
  },
  {
    name: "Material Component Health Scores",
    icon: PackageCheckIcon, // Checked package for health
    color: "#008080",
    href: "/MaterialComponentHealthScoreDashboard",
  },
  {
    name: "Turbine Model Health Scores",
    icon: BarChart2, // Same analytical symbol as above
    color: "#FF8C00",
    href: "/turbinePredictionsDashboard",
  },
  {
    name: "Category Classification Overview",
    icon: ChartNoAxesCombined, // Implies grouped data or classification
    color: "#FF4500",
    href: "/categoryClassificationDashboard",
  },
  {
    name: "CSV Upload Dashboard",
    icon: CloudUploadIcon,
    color: "#FF9F40",
    href: "/upload",
  },
  {
    name: "Fault Report Upload",
    icon: NotepadTextIcon,
    color: "#6A5ACD",
    href: "/fault-report",
  },
]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <motion.div
      className="relative z-20 h-screen flex-shrink-0"
      animate={{
        width: isSidebarOpen ? 240 : 88, // Increased widths for better scaling
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        className="h-full fixed bg-gray-800 bg-opacity-50 backdrop-blur-md flex flex-col border-r border-gray-700"
        style={{ width: isSidebarOpen ? 240 : 88 }} // Match the motion width
      >
        {/* Header with logo as toggle */}
        <div className="flex items-center justify-center p-4 border-b border-gray-700/50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <img src={logo || "/placeholder.svg"} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
          </motion.button>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="ml-3 font-semibold text-white truncate"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Scrollable navigation with equal spacing */}
        <nav className="flex-grow overflow-y-auto py-4">
          <div className="flex flex-col space-y-4 px-2">
            {SIDEBAR_ITEMS.map((item) => (
              <Link key={item.href} to={item.href}>
                <motion.div
                  className="flex items-center rounded-lg hover:bg-gray-700 transition-colors"
                  whileHover={{ x: 2 }}
                >
                  <div
                    className={`
               flex items-center w-full py-2 px-3
               ${isSidebarOpen ? "justify-start" : "justify-center"}
             `}
                  >
                    <item.icon
                      data-testid="sidebar-icon"
                      size={20}
                      style={{
                        color: item.color,
                        minWidth: "20px",
                      }}
                    />

                    <AnimatePresence>
                      {isSidebarOpen && (
                        <motion.span
                          className="ml-3 text-sm font-medium text-gray-200 truncate"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </motion.div>
  )
}

export default Sidebar
