import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

class SubscriptionsRepository {
  constructor() {
    this.collectionName = 'subscriptions';
  }

  async list(userId = null) {
    try {
      let q;
      if (userId) {
        q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId)
        );
      } else {
        q = query(
          collection(db, this.collectionName)
        );
      }
      const querySnapshot = await getDocs(q);
      const subscriptions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Ordina localmente per updatedAt
      return subscriptions.sort((a, b) => {
        const aTime = a.updatedAt?.toDate?.() || new Date(0);
        const bTime = b.updatedAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Errore nel caricamento degli abbonamenti:', error);
      return [];
    }
  }

  async get(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        return data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async create(subscriptionData, userId = null) {
    try {
      const dataToSave = {
        ...subscriptionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      if (userId) {
        dataToSave.userId = userId;
      }
      
      const docRef = await addDoc(collection(db, this.collectionName), dataToSave);
      return { id: docRef.id, ...dataToSave };
    } catch (error) {
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return { id, ...updates };
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const q = query(
        collection(db, this.collectionName),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      return [];
    }
  }

  async getActive(userId = null) {
    try {
      let q;
      if (userId) {
        q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          where('status', '==', 'active')
        );
      } else {
        q = query(
          collection(db, this.collectionName),
          where('status', '==', 'active')
        );
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Errore nel caricamento degli abbonamenti attivi:', error);
      return [];
    }
  }

  async search(query) {
    try {
      const subscriptions = await this.list();
      const lowerQuery = query.toLowerCase();
      
      return subscriptions.filter(sub => 
        sub.name.toLowerCase().includes(lowerQuery) ||
        (sub.category && sub.category.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      return [];
    }
  }
}

export default new SubscriptionsRepository();
