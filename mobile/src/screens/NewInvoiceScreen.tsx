import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createInvoice } from "../api";
import { useAuth } from "../auth";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "NewInvoice">;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function plusDaysISO(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function NewInvoiceScreen({ navigation }: Props) {
  const { token } = useAuth();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("");
  const [taxRate, setTaxRate] = useState("18");
  const [issueDate, setIssueDate] = useState(todayISO);
  const [dueDate, setDueDate] = useState(() => plusDaysISO(14));
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const preview = useMemo(() => {
    const qty = Number(quantity) || 0;
    const r = Number(rate) || 0;
    const tax = Number(taxRate) || 0;
    const sub = qty * r;
    const taxAmt = (sub * tax) / 100;
    return { sub, taxAmt, total: sub + taxAmt };
  }, [quantity, rate, taxRate]);

  async function save(status: "draft" | "sent") {
    if (!token) return;
    if (!clientName.trim()) {
      setError("Client name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Add a line description.");
      return;
    }
    if (!(Number(rate) > 0)) {
      setError("Enter a rate greater than 0.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const { invoice } = await createInvoice(token, {
        status,
        issueDate,
        dueDate,
        notes,
        interstate: false,
        client: {
          name: clientName.trim(),
          email: clientEmail.trim(),
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          taxId: "",
        },
        items: [
          {
            id: newId(),
            description: description.trim(),
            quantity: Number(quantity) || 1,
            rate: Number(rate) || 0,
            taxRate: Number(taxRate) || 0,
          },
        ],
      });
      navigation.replace("InvoiceDetail", { id: invoice.id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create invoice");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.section}>Client</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={clientName}
          onChangeText={setClientName}
          placeholder="Client or company"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={clientEmail}
          onChangeText={setClientEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="optional"
          placeholderTextColor="#9ca3af"
        />

        <Text style={styles.section}>Line item</Text>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Service or product"
          placeholderTextColor="#9ca3af"
        />
        <View style={styles.row}>
          <View style={styles.third}>
            <Text style={styles.label}>Qty</Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.third}>
            <Text style={styles.label}>Rate</Text>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor="#9ca3af"
            />
          </View>
          <View style={styles.third}>
            <Text style={styles.label}>Tax %</Text>
            <TextInput
              style={styles.input}
              value={taxRate}
              onChangeText={setTaxRate}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.section}>Dates</Text>
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Issue (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={issueDate}
              onChangeText={setIssueDate}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.half}>
            <Text style={styles.label}>Due (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              autoCapitalize="none"
            />
          </View>
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notes]}
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Payment terms…"
          placeholderTextColor="#9ca3af"
        />

        <View style={styles.totals}>
          <Text style={styles.muted}>
            Subtotal {preview.sub.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.muted}>
            Tax {preview.taxAmt.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.total}>
            Total {preview.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <Pressable
            style={[styles.btnSecondary, busy && styles.disabled]}
            disabled={busy}
            onPress={() => void save("draft")}
          >
            <Text style={styles.btnSecondaryText}>Save draft</Text>
          </Pressable>
          <Pressable
            style={[styles.btnPrimary, busy && styles.disabled]}
            disabled={busy}
            onPress={() => void save("sent")}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnPrimaryText}>Create invoice</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  section: {
    marginTop: 8,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 12,
  },
  notes: { minHeight: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 10 },
  third: { flex: 1 },
  half: { flex: 1 },
  totals: { alignItems: "flex-end", gap: 4, marginTop: 4, marginBottom: 12 },
  muted: { fontSize: 13, color: "#64748b" },
  total: { fontSize: 18, fontWeight: "700", color: "#0f172a", marginTop: 2 },
  error: { color: "#b91c1c", marginBottom: 12 },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  btnSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnSecondaryText: { fontWeight: "600", color: "#334155" },
  btnPrimary: {
    flex: 1.2,
    backgroundColor: "#0f172a",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnPrimaryText: { fontWeight: "600", color: "#fff" },
  disabled: { opacity: 0.65 },
});
