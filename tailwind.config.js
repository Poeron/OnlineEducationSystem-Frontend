module.exports = {
  darkMode: "class",
  content: [
    "./index.html", // Vite için gerekebilir
    "./src/**/*.{js,ts,jsx,tsx}", // Tüm React dosyalarını kapsar
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      animation: {
        rotateGradient: "animate 6s linear infinite",
      },
      keyframes: {
        animate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backgroundImage: {
        gradientBorder:
          "linear-gradient(0deg, transparent, transparent, #ff00bb, #ff00bb, #ff00bb)",
      },
    },
  },
  plugins: [],
};
