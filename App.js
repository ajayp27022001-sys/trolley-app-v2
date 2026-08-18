import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';

export default function App() {
  // Yeh ek basic list hai jo repair ke liye aayi trolleys/pallets dikhayegi
  const maintenanceTasks = [
    { id: '1', item: 'Trolley A', issue: 'Wheel Replacement', status: 'Pending' },
    { id: '2', item: 'Pallet B', issue: 'Base Broken', status: 'In Progress' },
    { id: '3', item: 'Trolley C', issue: 'Handle Welding', status: 'Pending' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Maintenance Dashboard</Text>
      </View>
      
      <FlatList
        data={maintenanceTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.item}</Text>
            <Text style={styles.taskIssue}>Issue: {item.issue}</Text>
            <Text style={styles.taskStatus}>Status: {item.status}</Text>
          </View>
        )}
      />
      
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add New Repair Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskIssue: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  taskStatus: {
    fontSize: 14,
    color: '#d9534f',
    marginTop: 4,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
