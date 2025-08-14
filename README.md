# EcoGo Energy Monitoring Application

A modern, responsive web application for monitoring and optimizing home energy usage. Track your electricity consumption, get smart insights, and reduce your energy bills with real-time analytics and intelligent recommendations.

## 🌟 Features

- **Real-time Energy Monitoring**: Track electricity usage with live updates
- **Smart Appliance Management**: Monitor individual appliances and their power consumption
- **Historical Analytics**: View usage patterns over different time periods
- **Intelligent Alerts**: Get notified about high usage and potential savings
- **Cost Optimization**: Calculate electricity costs and identify savings opportunities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Smart Plug Integration**: Simulate smart plug functionality for automated control

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecogo-energy-monitor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Vercel Deployment

#### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

#### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with your GitHub account
   - Click "New Project"
   - Import your repository
   - Deploy automatically

## 📁 Project Structure

```
ecogo-energy-monitor/
├── index.html              # Main application page
├── login.html              # Authentication page
├── script.js               # Main JavaScript application
├── styles.css              # Main stylesheet
├── auth-styles.css         # Authentication styles
├── package.json            # Project dependencies
├── vercel.json            # Vercel configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome for UI icons
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Deployment**: Vercel for hosting

## 📊 Key Features Explained

### Energy Tracking
- Manual appliance usage logging
- Automatic power consumption calculations
- Real-time usage monitoring
- Historical data analysis

### Smart Analytics
- Peak hours identification
- Usage pattern recognition
- Cost optimization suggestions
- Efficiency scoring

### User Experience
- Intuitive dashboard design
- Responsive mobile interface
- Theme switching capability
- Real-time notifications

## 🔧 Configuration

### Environment Variables
The application uses browser localStorage for data persistence. No server-side environment variables are required.

### Customization
- Modify `styles.css` for theme customization
- Update `script.js` for feature modifications
- Edit `index.html` for layout changes

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔮 Future Enhancements

- [ ] Real smart plug integration
- [ ] Machine learning for usage predictions
- [ ] Social features for community comparison
- [ ] Advanced reporting and exports
- [ ] Mobile app development
- [ ] API for third-party integrations

---

**Built with ❤️ for a sustainable future**
