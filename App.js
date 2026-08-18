import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';

// --- INITIAL MOCK DATA ---
const INITIAL_USERS = [
  { id: '1', name: 'Ramesh (Creator)', role: 'CREATOR' },
  { id: '2', name: 'Amit (Approver)', role: 'APPROVER' },
  { id: '3', name: 'Suresh (Forklift)', role: 'FORKLIFT' },
  { id: '4', name: 'Vikram (Supervisor)', role: 'SUPERVISOR' },
  { id: '5', name: 'Rajesh (Dept Head)', role: 'HEAD' },
  { id: '6', name: 'Ajay (Admin/Owner)', role: 'ADMIN' },
  { id: '7', name: 'Kishan (Informer)', role: 'INFORMER' },
];

export default function App() {
  // Navigation & User State
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]);
  const [employees, setEmployees] = useState(INITIAL_USERS);
  const [attendance, setAttendance] = useState({ '1': 'PRESENT', '2': 'PRESENT' });

  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 'TRL-101', trolleyNo: 'TR-04', location: 'Bay 2 - Line A', status: 'PENDING_APPROVAL', createdBy: 'Ramesh', beforeImage: '📷 [Damaged Wheel Photo Attached]', afterImage: '', remarks: 'Left wheel bent' },
    { id: 'TRL-102', trolleyNo: 'TR-18', location: 'Shop Floor 1', status: 'APPROVED', createdBy: 'Ramesh', beforeImage: '📷 [Broken Handle Photo Attached]', afterImage: '', remarks: 'Handle welding required' }
  ]);

  // Form Inputs State
  const [trolleyNo, setTrolleyNo] = useState('');
  const [location, setLocation] = useState('');
  const [remarks, setRemarks] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('CREATOR');

  // --- ACTIONS ---
  const handleCreateTask = () => {
    if (!trolleyNo || !location) {
      Alert.alert('Error', 'Trolley Number aur Location daalna zaroori hai.');
      return;
    }
    const newTask = {
      id: `TRL-${Math.floor(100 + Math.random() * 900)}`,
      trolleyNo,
      location,
      status: 'PENDING_APPROVAL',
      createdBy: currentUser.name,
      beforeImage: '📷 [Shopfloor Photo Captured]',
      afterImage: '',
      remarks: remarks || 'Repair Needed'
    };
    setTasks([newTask, ...tasks]);
    setTrolleyNo('');
    setLocation('');
    setRemarks('');
    Alert.alert('Success', 'Task create ho gaya aur approval ke liye bhej diya gaya.');
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const toggleAttendance = (empId) => {
    setAttendance(prev => ({
      ...prev,
      [empId]: prev[empId] === 'PRESENT' ? 'ABSENT' : 'PRESENT'
    }));
  };

  const handleAddEmployee = () => {
    if (!newEmpName) return;
    const newEmp = { id: `${employees.length + 1}`, name: newEmpName, role: newEmpRole };
    setEmployees([...employees, newEmp]);
    setNewEmpName('');
    Alert.alert('Success', 'Naya employee add ho gaya.');
  };

  // --- ROLE-BASED SCREENS ---

  // 1. Task Creator Screen
  const renderCreatorView = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionHeader}>Create Trolley Repair Task</Text>
      <TextInput style={styles.input} placeholder="Trolley Number (e.g. TR-22)" value={trolleyNo} onChangeText={setTrolleyNo} />
      <TextInput style={styles.input} placeholder="Current Location (e.g. Bay 4)" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Issue / Remarks" value={remarks} onChangeText={setRemarks} />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleCreateTask}>
        <Text style={styles.btnText}>📸 Capture Before Photo & Submit</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>My Created Tasks</Text>
      {tasks.filter(t => t.createdBy.includes(currentUser.name.split(' ')[0])).map(t => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.cardTitle}>{t.id} - Trolley: {t.trolleyNo}</Text>
          <Text style={styles.cardSub}>Location: {t.location}</Text>
          <Text style={styles.cardSub}>{t.beforeImage}</Text>
          <Text style={[styles.badge, styles[t.status]]}>{t.status}</Text>
          {t.status === 'IN_TRANSIT' && (
            <TouchableOpacity style={[styles.primaryBtn, { marginTop: 8, backgroundColor: '#2e7d32' }]} onPress={() => updateTaskStatus(t.id, 'COMPLETED')}>
              <Text style={styles.btnText}>Submit Completed Work (After Photo)</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );

  // 2. Approver Screen
  const renderApproverView = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionHeader}>Pending Approvals</Text>
      {tasks.filter(t => t.status === 'PENDING_APPROVAL').length === 0 && (
        <Text style={styles.emptyText}>Koi pending approval nahi hai.</Text>
      )}
      {tasks.filter(t => t.status === 'PENDING_APPROVAL').map(t => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.cardTitle}>{t.id} | Trolley: {t.trolleyNo}</Text>
          <Text style={styles.cardSub}>Location: {t.location}</Text>
          <Text style={styles.cardSub}>Issue: {t.remarks}</Text>
          <Text style={styles.cardSub}>{t.beforeImage}</Text>
          <View style={styles.row}>
            <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#2e7d32' }]} onPress={() => updateTaskStatus(t.id, 'APPROVED')}>
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#c62828' }]} onPress={() => updateTaskStatus(t.id, 'REJECTED')}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Processed Tasks</Text>
      {tasks.filter(t => t.status !== 'PENDING_APPROVAL').map(t => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.cardTitle}>{t.id} - Trolley: {t.trolleyNo}</Text>
          <Text style={[styles.badge, styles[t.status]]}>{t.status}</Text>
        </View>
      ))}
    </ScrollView>
  );

  // 3. Forklift Operator Screen
  const renderForkliftView = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionHeader}>Approved Tasks for Pickup</Text>
      {tasks.filter(t => t.status === 'APPROVED').map(t => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.cardTitle}>{t.id} - Trolley: {t.trolleyNo}</Text>
          <Text style={styles.cardSub}>📍 Pickup From: {t.location}</Text>
          <Text style={styles.cardSub}>{t.beforeImage}</Text>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#e65100', marginTop: 8 }]} onPress={() => updateTaskStatus(t.id, 'IN_TRANSIT')}>
            <Text style={styles.btnText}>Confirm Pickup & Move to Repair</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Ready for Return to Location</Text>
      {tasks.filter(t => t.status === 'COMPLETED').map(t => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.cardTitle}>{t.id} - Trolley: {t.trolleyNo}</Text>
          <Text style={styles.cardSub}>📍 Return To: {t.location}</Text>
          <Text style={[styles.badge, styles.COMPLETED]}>REPAIR DONE</Text>
        </View>
      ))}
    </ScrollView>
  );

  // 4. Supervisor Screen (Attendance + Overview)
  const renderSupervisorView = () => (
    <ScrollView style={styles.content}>
      <Text style={styles.sectionHeader}>Staff Attendance</Text>
      {employees.map(emp => (
        <View key={emp.id} style={[styles.card, styles.rowBetween]}>
          <View>
            <Text style={styles.cardTitle}>{emp.name}</Text>
            <Text style={styles.cardSub}>Role: {emp.role}</Text>
          </View>
          <TouchableOpacity style={[styles.smallBtn, { backgroundColor: attendance[emp.id] === 'PRESENT' ? '#2e7d32' : '#c62828' }]} onPress={() => toggleAttendance(emp.id)}>
            <Text style={styles.btnText}>{attendance[emp.id] || 'ABSENT'}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Add New Employee</Text>
      <TextInput style={styles.input} placeholder="Employee Name" value={newEmpName} onChangeText={setNewEmpName} />
      <TouchableOpacity style={styles.primaryBtn} onPress={handleAddEmployee}>
        <Text style={styles.btnText}>Add Employee</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // 5. Dept Head / Admin / Owner Dashboard
  const renderDashboardView = () => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'PENDING_APPROVAL').length;
    const approved = tasks.filter(t => t.status === 'APPROVED').length;
    const inTransit = tasks.filter(t => t.status === 'IN_TRANSIT').length;
    const completed = tasks.filter(t => t.status === 'COMPLETED').length;
    const rejected = tasks.filter(t => t.status === 'REJECTED').length;

    return (
      <ScrollView style={styles.content}>
        <Text style={styles.sectionHeader}>Plant Operations Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{total}</Text>
            <Text>Total Tasks</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{pending}</Text>
            <Text>Pending</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{approved}</Text>
            <Text>Approved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{inTransit}</Text>
            <Text>In Transit</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{completed}</Text>
            <Text>Done</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{rejected}</Text>
            <Text>Rejected</Text>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Live Activity Feed</Text>
        {tasks.map(t => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.cardTitle}>{t.id} - Trolley {t.trolleyNo}</Text>
            <Text style={styles.cardSub}>Loc: {t.location} | Creator: {t.createdBy}</Text>
            <Text style={[styles.badge, styles[t.status]]}>{t.status}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  // Route selector based on logged-in role
  const renderScreenByRole = () => {
    switch (currentUser.role) {
      case 'CREATOR':
      case 'INFORMER':
        return renderCreatorView();
      case 'APPROVER':
        return renderApproverView();
      case 'FORKLIFT':
        return renderForkliftView();
      case 'SUPERVISOR':
        return renderSupervisorView();
      case 'HEAD':
      case 'ADMIN':
      default:
        return renderDashboardView();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Top App Header */}
      <View style={styles.topBar}>
        <Text style={styles.appHeading}>TROLLEY OPS PRO</Text>
        <Text style={styles.userBadge}>{currentUser.name}</Text>
      </View>

      {/* Role Switcher for Demo/Testing */}
      <View style={styles.rolePickerContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {employees.map(u => (
            <TouchableOpacity
              key={u.id}
              style={[styles.roleTab, currentUser.id === u.id && styles.roleTabActive]}
              onPress={() => setCurrentUser(u)}
            >
              <Text style={[styles.roleTabText, currentUser.id === u.id && styles.roleTabTextActive]}>{u.role}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Body */}
      {renderScreenByRole()}
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  topBar: { backgroundColor: '#1a237e', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appHeading: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  userBadge: { color: '#ffca28', fontSize: 13, fontWeight: '600' },
  rolePickerContainer: { backgroundColor: '#283593', paddingVertical: 8, paddingHorizontal: 6 },
  roleTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#3949ab', marginRight: 8 },
  roleTabActive: { backgroundColor: '#ffca28' },
  roleTabText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  roleTabTextActive: { color: '#000' },
  content: { flex: 1, padding: 16 },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 },
  primaryBtn: { backgroundColor: '#1565c0', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginBottom: 10, elevation: 2 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  cardSub: { fontSize: 13, color: '#666', marginTop: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 8, fontSize: 11, fontWeight: 'bold' },
  PENDING_APPROVAL: { backgroundColor: '#fff3e0', color: '#e65100' },
  APPROVED: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  REJECTED: { backgroundColor: '#ffebee', color: '#c62828' },
  IN_TRANSIT: { backgroundColor: '#e1f5fe', color: '#0277bd' },
  COMPLETED: { backgroundColor: '#e8f5e9', color: '#2e7d32' },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  emptyText: { color: '#888', fontStyle: 'italic', marginVertical: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statBox: { width: '31%', backgroundColor: '#fff', padding: 12, borderRadius: 8, alignItems: 'center', elevation: 1 },
  statNum: { fontSize: 18, fontWeight: 'bold', color: '#1a237e' }
});
