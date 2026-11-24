import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchInvoice, patchInvoiceStatus } from "../api";
import { useAuth } from "../auth";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "InvoiceDetail">;

export function InvoiceDetailScreen({ route }: Props) {
  const { id } = route.params;
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [invoice, setInvoice] = useState<{
    number: string;
    status: string;
    issueDate: string;
    dueDate: string;
    notes: string;
    client: Record<string, string>;
    items: {
      id: string;
      description: string;
      quantity: number;
      rate: number;
      taxRate: number;
    }[];
  } | null>(null);
  const [businessName, setBusinessName] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const data = await fetchInvoice(token, id);
      setInvoice(data.invoice);
      setBusinessName(data.business?.name ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load invoice");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void load();
    }, [load])
  );

  async function setStatus(status: "draft" | "sent" | "paid") {
    if (!token || !invoice) return;
    setBusy(true);
    try {
      await patchInvoiceStatus(token, id, status);
      setInvoice({ ...invoice, status });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#0f172a" />
      </View>
    );
  }

  if (error || !invoice) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error ?? "Not found"}</Text>
        <Pressable style={styles.btn} onPress={() => void load()}>
          <Text style={styles.btnText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const subtotal = invoice.items.reduce(
    (s, i) => s + i.quantity * i.rate,
    0
  );
  const tax = invoice.items.reduce(
    (s, i) => s + (i.quantity * i.rate * i.taxRate) / 100,
    0
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Text style={styles.number}>{invoice.number}</Text>
      <Text style={styles.biz}>{businessName}</Text>
      <Text style={styles.status}>Status: {invoice.status}</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Bill to</Text>
        <Text style={styles.value}>{invoice.client.name}</Text>
        {invoice.client.email ? (
          <Text style={styles.muted}>{invoice.client.email}</Text>
        ) : null}
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Issue</Text>
          <Text style={styles.value}>{invoice.issueDate}</Text>
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Due</Text>
          <Text style={styles.value}>{invoice.dueDate}</Text>
        </View>
      </View>

      <Text style={[styles.label, { marginTop: 16 }]}>Line items</Text>
      {invoice.items.map((item) => (
        <View key={item.id} style={styles.line}>
          <Text style={styles.lineDesc}>{item.description}</Text>
          <Text style={styles.muted}>
            {item.quantity} × {item.rate} (+{item.taxRate}% tax)
          </Text>
        </View>
      ))}

      <View style={styles.totals}>
        <Text style={styles.muted}>Subtotal {subtotal.toFixed(2)}</Text>
        <Text style={styles.muted}>Tax {tax.toFixed(2)}</Text>
        <Text style={styles.total}>Total {(subtotal + tax).toFixed(2)}</Text>
      </View>

      {invoice.notes ? (
        <View style={styles.block}>
          <Text style={styles.label}>Notes</Text>
          <Text style={styles.value}>{invoice.notes}</Text>
        </View>
      ) : null}

      <Text style={[styles.label, { marginTop: 20 }]}>Mark as</Text>
      <View style={styles.actions}>
        {(["draft", "sent", "paid"] as const).map((s) => (
          <Pressable
            key={s}
            style={[
              styles.chip,
              invoice.status === s && styles.chipActive,
              busy && { opacity: 0.6 },
            ]}
            disabled={busy || invoice.status === s}
            onPress={() => void setStatus(s)}
          >
            <Text
              style={[
                styles.chipText,
                invoice.status === s && styles.chipTextActive,
              ]}
            >
              {s}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  number: { fontSize: 24, fontWeight: "700", color: "#0f172a" },
  biz: { marginTop: 4, color: "#64748b" },
  status: { marginTop: 8, fontWeight: "600", color: "#334155", textTransform: "capitalize" },
  block: { marginTop: 20 },
  label: { fontSize: 12, fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" },
  value: { marginTop: 4, fontSize: 16, color: "#0f172a" },
  muted: { marginTop: 2, fontSize: 13, color: "#64748b" },
  row: { flexDirection: "row", marginTop: 16, gap: 16 },
  half: { flex: 1 },
  line: {
    marginTop: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  lineDesc: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  totals: { marginTop: 16, alignItems: "flex-end", gap: 4 },
  total: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginTop: 4 },
  actions: { flexDirection: "row", gap: 8, marginTop: 10 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipActive: { backgroundColor: "#0f172a", borderColor: "#0f172a" },
  chipText: { fontWeight: "600", color: "#334155", textTransform: "capitalize" },
  chipTextActive: { color: "#fff" },
  error: { color: "#b91c1c", marginBottom: 12 },
  btn: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
