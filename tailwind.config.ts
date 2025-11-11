import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "helvetica", "arial", "sans-serif"],
        brand: ["Founders Grotesk", "Inter", "helvetica", "arial", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
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
        "background-neutral-featured": {
          DEFAULT: "hsl(var(--background-neutral-featured))",
          foreground: "hsl(var(--background-neutral-featured-foreground))",
        },
        // Ecosia Flora Colors
        grellow: {
          100: "hsl(var(--grellow-100))",
          200: "hsl(var(--grellow-200))",
          300: "hsl(var(--grellow-300))",
          400: "hsl(var(--grellow-400))",
          500: "hsl(var(--grellow-500))",
          600: "hsl(var(--grellow-600))",
          700: "hsl(var(--grellow-700))",
          800: "hsl(var(--grellow-800))",
          900: "hsl(var(--grellow-900))",
        },
        green: {
          50: "hsl(var(--green-50))",
          100: "hsl(var(--green-100))",
          200: "hsl(var(--green-200))",
          300: "hsl(var(--green-300))",
          400: "hsl(var(--green-400))",
          500: "hsl(var(--green-500))",
          600: "hsl(var(--green-600))",
          700: "hsl(var(--green-700))",
          800: "hsl(var(--green-800))",
          900: "hsl(var(--green-900))",
        },
        "light-green": {
          50: "hsl(var(--light-green-50))",
          100: "hsl(var(--light-green-100))",
          200: "hsl(var(--light-green-200))",
          300: "hsl(var(--light-green-300))",
          400: "hsl(var(--light-green-400))",
          500: "hsl(var(--light-green-500))",
          600: "hsl(var(--light-green-600))",
          700: "hsl(var(--light-green-700))",
          800: "hsl(var(--light-green-800))",
          900: "hsl(var(--light-green-900))",
        },
        "dark-green": {
          50: "hsl(var(--dark-green-50))",
          100: "hsl(var(--dark-green-100))",
          200: "hsl(var(--dark-green-200))",
          300: "hsl(var(--dark-green-300))",
          400: "hsl(var(--dark-green-400))",
          500: "hsl(var(--dark-green-500))",
          600: "hsl(var(--dark-green-600))",
          700: "hsl(var(--dark-green-700))",
          800: "hsl(var(--dark-green-800))",
          900: "hsl(var(--dark-green-900))",
        },
        red: {
          50: "hsl(var(--red-50))",
          100: "hsl(var(--red-100))",
          200: "hsl(var(--red-200))",
          300: "hsl(var(--red-300))",
          400: "hsl(var(--red-400))",
          500: "hsl(var(--red-500))",
          600: "hsl(var(--red-600))",
          700: "hsl(var(--red-700))",
          800: "hsl(var(--red-800))",
          900: "hsl(var(--red-900))",
        },
        blue: {
          50: "hsl(var(--blue-50))",
          100: "hsl(var(--blue-100))",
          200: "hsl(var(--blue-200))",
          300: "hsl(var(--blue-300))",
          400: "hsl(var(--blue-400))",
          500: "hsl(var(--blue-500))",
          600: "hsl(var(--blue-600))",
          700: "hsl(var(--blue-700))",
          800: "hsl(var(--blue-800))",
          900: "hsl(var(--blue-900))",
        },
        peach: {
          50: "hsl(var(--peach-50))",
          100: "hsl(var(--peach-100))",
          200: "hsl(var(--peach-200))",
          300: "hsl(var(--peach-300))",
          400: "hsl(var(--peach-400))",
          500: "hsl(var(--peach-500))",
          600: "hsl(var(--peach-600))",
          700: "hsl(var(--peach-700))",
          800: "hsl(var(--peach-800))",
          900: "hsl(var(--peach-900))",
        },
        yellow: {
          50: "hsl(var(--yellow-50))",
          100: "hsl(var(--yellow-100))",
          200: "hsl(var(--yellow-200))",
          300: "hsl(var(--yellow-300))",
          400: "hsl(var(--yellow-400))",
          500: "hsl(var(--yellow-500))",
          600: "hsl(var(--yellow-600))",
          700: "hsl(var(--yellow-700))",
          800: "hsl(var(--yellow-800))",
          900: "hsl(var(--yellow-900))",
        },
        gray: {
          10: "hsl(var(--gray-10))",
          20: "hsl(var(--gray-20))",
          30: "hsl(var(--gray-30))",
          40: "hsl(var(--gray-40))",
          50: "hsl(var(--gray-50))",
          60: "hsl(var(--gray-60))",
          70: "hsl(var(--gray-70))",
          80: "hsl(var(--gray-80))",
          90: "hsl(var(--gray-90))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slide-in-bottom": {
          from: {
            transform: "translateY(100%)",
            opacity: "0",
          },
          to: {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        "scale-in": {
          from: {
            transform: "scale(0.95)",
            opacity: "0",
          },
          to: {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
