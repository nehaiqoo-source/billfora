import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchInvoices, type InvoiceListItem } from "../api";
import { useAuth } from "../auth";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Invoices">;

function lineTotal(inv: InvoiceListItem) {
  return inv.items.reduce((sum, item) => {
    const base = item.quantity * item.rate;
    return sum + base + (base * item.taxRate) / 100;
  }, 0);
}

export function InvoicesScreen({ navigation }: Props) {
  const { token, user, signOut } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const data = await fetchInvoices(token);
      setInvoices(data.invoices);
      setBusinessName(data.business?.name ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load invoices");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void load();
    }, [load])
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.title}>{businessName ?? "Invoices"}</Text>
          <Text style={styles.meta}>
            {user?.email} · {user?.plan ?? "free"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.newBtn}
            onPress={() => navigation.navigate("FastCreate")}
          >
            <Text style={styles.newBtnText}>New</Text>
          </Pressable>
          <Pressable onPress={() => void signOut()} hitSlop={8}>
            <Text style={styles.signOut}>Sign out</Text>
          </Pressable>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#0f172a" />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.retry} onPress={() => void load()}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            invoices.length === 0 ? styles.emptyList : styles.list
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void load();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>No invoices yet.</Text>
              <Pressable
                style={styles.retry}
                onPress={() => navigation.navigate("FastCreate")}
              >
                <Text style={styles.retryText}>Quick invoice</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate("InvoiceDetail", { id: item.id })}
            >
              <View style={styles.rowTop}>
                <Text style={styles.number}>{item.number}</Text>
                <Text style={[styles.badge, badgeStyle(item.status)]}>
                  {item.status}
                </Text>
              </View>
              <Text style={styles.client}>{item.client?.name || "Client"}</Text>
              <View style={styles.rowBottom}>
                <Text style={styles.date}>{item.issueDate}</Text>
                <Text style={styles.amount}>
                  {lineTotal(item).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function badgeStyle(status: string) {
  if (status === "paid") return styles.paid;
  if (status === "sent") return styles.sent;
  return styles.draft;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  meta: { marginTop: 4, fontSize: 13, color: "#64748b" },
  headerActions: { alignItems: "flex-end", gap: 10 },
  newBtn: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  newBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  signOut: { color: "#0f172a", fontWeight: "600", fontSize: 14 },
  list: { padding: 16, gap: 10, paddingBottom: 32 },
  emptyList: { flexGrow: 1, justifyContent: "center", padding: 24 },
  emptyWrap: { alignItems: "center", gap: 14 },
  empty: { textAlign: "center", color: "#64748b", fontSize: 15 },
  center: { padding: 24, alignItems: "center" },
  error: { color: "#b91c1c", textAlign: "center", marginBottom: 12 },
  retry: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "#fff", fontWeight: "600" },
  row: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 10,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  number: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },
  draft: { backgroundColor: "#f1f5f9", color: "#475569" },
  sent: { backgroundColor: "#e0f2fe", color: "#0369a1" },
  paid: { backgroundColor: "#dcfce7", color: "#166534" },
  client: { marginTop: 6, fontSize: 15, color: "#334155" },
  rowBottom: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: { fontSize: 13, color: "#94a3b8" },
  amount: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
});
