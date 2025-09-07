# Hotel Management System - Installation Guide

## System Requirements

### Minimum Requirements
- **RAM**: 4GB (8GB recommended)
- **Storage**: 2GB free space
- **Internet**: Broadband connection for initial setup and sync
- **Display**: 1024x768 resolution minimum

### Platform-Specific Requirements

#### Android
- **OS Version**: Android 8.0 (API level 26) or higher
- **RAM**: 3GB minimum, 4GB recommended
- **Storage**: 500MB free space
- **Permissions**: Storage, Network, Camera (for document scanning)

#### iOS
- **OS Version**: iOS 13.0 or later
- **Device**: iPhone 7 or newer, iPad (6th generation) or newer
- **Storage**: 500MB free space
- **Permissions**: Storage, Network, Camera

#### Windows
- **OS Version**: Windows 10 version 1903 or later
- **Architecture**: x64 processor
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB free space
- **.NET**: .NET 6.0 Runtime (included in installer)

#### macOS
- **OS Version**: macOS 10.15 (Catalina) or later
- **Architecture**: Intel x64 or Apple Silicon (M1/M2)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB free space

## Installation Instructions

### Android Installation

#### Method 1: APK Installation (Recommended)
1. **Download APK**
   ```
   Download: hotel-management-system.apk
   Size: ~45MB
   ```

2. **Enable Unknown Sources**
   - Go to Settings > Security & Privacy
   - Enable "Install apps from unknown sources"
   - Or enable for specific browser/file manager

3. **Install APK**
   - Open the downloaded APK file
   - Tap "Install" when prompted
   - Wait for installation to complete
   - Tap "Open" to launch the app

4. **Grant Permissions**
   - Allow storage access for data backup
   - Allow network access for synchronization
   - Allow camera access for document scanning (optional)

#### Method 2: Google Play Store (If Available)
1. Open Google Play Store
2. Search for "Hotel Management System"
3. Tap "Install"
4. Wait for automatic installation
5. Tap "Open" to launch

### iOS Installation

#### Method 1: TestFlight (Beta)
1. **Install TestFlight**
   - Download TestFlight from App Store if not installed

2. **Join Beta**
   - Open the TestFlight invitation link
   - Tap "Accept" to join the beta program
   - Tap "Install" to download the app

3. **Launch App**
   - Find the app on your home screen
   - Tap to launch and begin setup

#### Method 2: App Store (If Available)
1. Open App Store
2. Search for "Hotel Management System"
3. Tap "Get" to download
4. Wait for installation
5. Tap "Open" to launch

### Windows Installation

#### Method 1: MSI Installer (Recommended)
1. **Download Installer**
   ```
   Download: HotelManagementSystem-Setup.msi
   Size: ~120MB
   ```

2. **Run Installer**
   - Right-click the MSI file
   - Select "Run as administrator"
   - Follow the installation wizard

3. **Installation Steps**
   - Accept the license agreement
   - Choose installation directory (default: C:\Program Files\Hotel Management System)
   - Select components to install
   - Click "Install" to begin

4. **Complete Installation**
   - Wait for installation to complete
   - Click "Finish" to exit installer
   - Launch from Start Menu or Desktop shortcut

#### Method 2: Portable Version
1. **Download Portable**
   ```
   Download: HotelManagementSystem-Portable.zip
   Size: ~95MB
   ```

2. **Extract Files**
   - Extract ZIP to desired location
   - No installation required

3. **Run Application**
   - Navigate to extracted folder
   - Double-click HotelManagementSystem.exe
   - Create desktop shortcut if desired

### macOS Installation

#### Method 1: DMG Installer (Recommended)
1. **Download DMG**
   ```
   Download: HotelManagementSystem.dmg
   Size: ~110MB
   ```

2. **Mount DMG**
   - Double-click the DMG file
   - Wait for disk image to mount

3. **Install Application**
   - Drag the app icon to Applications folder
   - Wait for copy to complete
   - Eject the disk image

4. **First Launch**
   - Open Applications folder
   - Double-click Hotel Management System
   - Click "Open" when security prompt appears

#### Method 2: App Store (If Available)
1. Open Mac App Store
2. Search for "Hotel Management System"
3. Click "Get" to download
4. Wait for installation
5. Launch from Applications or Launchpad

## Database Setup

### Supabase Configuration (Recommended)

#### Option 1: Use Hosted Supabase
1. **Create Supabase Account**
   - Visit https://supabase.com
   - Sign up for free account
   - Create new project

2. **Configure Project**
   - Set project name: "Hotel Management"
   - Choose region closest to your location
   - Set strong database password

3. **Get Connection Details**
   - Copy Project URL
   - Copy API Key (anon/public)
   - Note these for app configuration

4. **Configure App**
   - Launch Hotel Management System
   - Go to Settings > Database
   - Enter Supabase URL and API Key
   - Test connection

#### Option 2: Self-Hosted Database
1. **Install PostgreSQL**
   - Download from https://postgresql.org
   - Install with default settings
   - Note username and password

2. **Create Database**
   ```sql
   CREATE DATABASE hotel_management;
   CREATE USER hotel_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE hotel_management TO hotel_user;
   ```

3. **Configure App**
   - Launch Hotel Management System
   - Go to Settings > Database
   - Enter local database connection details
   - Test connection

### Initial Data Setup

1. **Run Database Migrations**
   - App will automatically create required tables
   - Wait for migration to complete
   - Check for any error messages

2. **Create Admin User**
   - First user is automatically admin
   - Use strong password
   - Verify email if required

3. **Import Sample Data (Optional)**
   - Go to Settings > Data Management
   - Import sample hotel data
   - Review imported rooms, menu items, etc.

## Network Configuration

### Firewall Settings

#### Windows Firewall
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Add Hotel Management System
4. Allow both Private and Public networks

#### macOS Firewall
1. Go to System Preferences > Security & Privacy
2. Click Firewall tab
3. Click "Firewall Options"
4. Add Hotel Management System to allowed apps

### Port Requirements
- **HTTP**: Port 80 (for web interface)
- **HTTPS**: Port 443 (for secure connections)
- **Database**: Port 5432 (PostgreSQL) or 3306 (MySQL)
- **Sync**: Port 8080 (for device synchronization)

### Network Troubleshooting
1. **Test Internet Connection**
   ```bash
   ping google.com
   ```

2. **Test Database Connection**
   - Use app's built-in connection test
   - Check database server status
   - Verify credentials

3. **Check Firewall Logs**
   - Look for blocked connections
   - Add exceptions as needed

## Multi-Device Setup

### Primary Device Setup
1. **Install on Main Device**
   - Complete full installation
   - Configure database connection
   - Create admin account
   - Import initial data

2. **Generate Sync Code**
   - Go to Settings > Device Management
   - Click "Generate Sync Code"
   - Note the 6-digit code
   - Code expires in 10 minutes

### Secondary Device Setup
1. **Install App**
   - Follow platform-specific installation
   - Launch app for first time

2. **Connect to Primary**
   - Select "Connect to Existing System"
   - Enter sync code from primary device
   - Wait for data synchronization
   - Verify connection successful

3. **Configure User Account**
   - Log in with existing credentials
   - Or create new staff account
   - Set appropriate role permissions

### Sync Configuration
1. **Automatic Sync**
   - Enabled by default
   - Syncs every 5 minutes when online
   - Syncs immediately on data changes

2. **Manual Sync**
   - Pull down to refresh on mobile
   - Click sync button on desktop
   - Use keyboard shortcut Ctrl+R (Cmd+R on Mac)

3. **Offline Mode**
   - Automatically enabled when offline
   - Data cached locally
   - Syncs when connection restored

## Security Configuration

### User Account Security
1. **Password Policy**
   - Minimum 8 characters
   - Must include uppercase, lowercase, number
   - Special characters recommended
   - Change every 90 days (recommended)

2. **Two-Factor Authentication**
   - Enable in Settings > Security
   - Use authenticator app (Google Authenticator, Authy)
   - Backup recovery codes

3. **Session Management**
   - Sessions expire after 8 hours of inactivity
   - Force logout on all devices option
   - Monitor active sessions

### Data Encryption
1. **Data at Rest**
   - Database encryption enabled by default
   - Local data encrypted with AES-256
   - Backup files encrypted

2. **Data in Transit**
   - All connections use TLS 1.3
   - Certificate pinning enabled
   - No unencrypted data transmission

### Access Control
1. **Role-Based Permissions**
   - Manager: Full access
   - Receptionist: Rooms, bookings, orders
   - Kitchen Staff: Restaurant, inventory
   - Bar Staff: Bar, pool, inventory
   - Housekeeping: Room status only

2. **IP Restrictions (Optional)**
   - Limit access to specific IP ranges
   - Configure in Settings > Security
   - Useful for hotel-only access

## Backup Configuration

### Automatic Backups
1. **Local Backups**
   - Daily backups to local storage
   - Keep 7 days of backups
   - Configurable in Settings > Backup

2. **Cloud Backups**
   - Weekly backups to cloud storage
   - Encrypted before upload
   - Supports Google Drive, Dropbox, OneDrive

### Manual Backup
1. **Export Data**
   - Go to Settings > Data Management
   - Click "Export All Data"
   - Choose backup location
   - Wait for export to complete

2. **Backup Verification**
   - Test restore process monthly
   - Verify backup integrity
   - Document backup procedures

## Troubleshooting Installation

### Common Issues

#### Installation Fails
**Windows**: "Installation package corrupt"
- Re-download installer
- Run as administrator
- Disable antivirus temporarily
- Check disk space

**macOS**: "App can't be opened"
- Right-click app, select "Open"
- Go to System Preferences > Security
- Click "Open Anyway"

**Android**: "App not installed"
- Enable unknown sources
- Clear download cache
- Restart device
- Check storage space

#### Database Connection Issues
1. **Check Network**
   - Verify internet connection
   - Test database server accessibility
   - Check firewall settings

2. **Verify Credentials**
   - Double-check username/password
   - Ensure database exists
   - Check user permissions

3. **Connection Timeout**
   - Increase timeout in settings
   - Check server load
   - Try different network

#### Sync Problems
1. **Devices Not Syncing**
   - Check internet on all devices
   - Verify same account logged in
   - Force manual sync
   - Restart apps

2. **Data Conflicts**
   - Review conflict resolution
   - Choose correct version
   - Merge data manually if needed

### Getting Help

#### Self-Help Resources
1. **Built-in Help**
   - Press F1 or Help menu
   - Search help topics
   - View video tutorials

2. **Online Resources**
   - User manual: docs.hotelmanagementsystem.com
   - FAQ: support.hotelmanagementsystem.com/faq
   - Community forum: community.hotelmanagementsystem.com

#### Technical Support
1. **Email Support**
   - support@hotelmanagementsystem.com
   - Include system information
   - Attach error logs if available
   - Response within 24 hours

2. **Phone Support**
   - 1-800-HOTEL-HELP
   - Available 24/7
   - Have license key ready
   - Remote assistance available

3. **Emergency Support**
   - 1-800-URGENT-HELP
   - Critical system failures only
   - Available 24/7
   - Immediate response

## Post-Installation Checklist

### Initial Setup
- [ ] App installed successfully
- [ ] Database connection configured
- [ ] Admin account created
- [ ] Basic hotel information entered
- [ ] Staff accounts created
- [ ] Room data imported/entered
- [ ] Menu items configured
- [ ] Inventory items added

### Security Setup
- [ ] Strong passwords set
- [ ] Two-factor authentication enabled
- [ ] User roles configured
- [ ] Backup schedule configured
- [ ] Firewall rules added
- [ ] SSL certificates installed

### Testing
- [ ] Create test booking
- [ ] Process test order
- [ ] Update room status
- [ ] Generate test report
- [ ] Test offline mode
- [ ] Verify data sync
- [ ] Test backup/restore

### Training
- [ ] Staff training scheduled
- [ ] User manual distributed
- [ ] Quick reference guides printed
- [ ] Support contacts shared
- [ ] Backup procedures documented

## Maintenance Schedule

### Daily Tasks
- Check system status
- Verify backups completed
- Monitor sync status
- Review error logs

### Weekly Tasks
- Update software if available
- Test backup restore
- Review user accounts
- Check storage usage

### Monthly Tasks
- Security audit
- Performance review
- User training refresh
- Documentation updates

### Quarterly Tasks
- Full system backup
- Security assessment
- Hardware maintenance
- License renewal check

---

## Support Information

**Technical Support**
- Email: support@hotelmanagementsystem.com
- Phone: 1-800-HOTEL-HELP
- Hours: 24/7 Support Available
- Website: www.hotelmanagementsystem.com

**Emergency Support**
- Phone: 1-800-URGENT-HELP
- Available 24/7 for critical issues

**Sales & Licensing**
- Email: sales@hotelmanagementsystem.com
- Phone: 1-800-HOTEL-SALES
- Hours: Monday-Friday, 9 AM - 6 PM EST

---

*Installation guide version 1.0 - Updated regularly*