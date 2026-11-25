import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createInvoice } from "../api";
import { useAuth } from "../auth";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "FastCreate">;

type Step = "who" | "what" | "amount" | "confirm";

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

export function FastCreateScreen({ navigation }: Props) {
  const { token } = useAuth();
  const [step, setStep] = useState<Step>("who");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rate = Number(amount) || 0;
  const taxRate = 18;
  const preview = useMemo(() => {
    const tax = (rate * taxRate) / 100;
    return { tax, total: rate + tax };
  }, [rate]);

  async function create() {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const { invoice } = await createInvoice(token, {
        status: "sent",
        issueDate: todayISO(),
        dueDate: plusDaysISO(14),
        notes: "Created from BillFora mobile",
        interstate: false,
        client: {
          name: clientName.trim(),
          email: "",
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
            description: description.trim() || "Services",
            quantity: 1,
            rate,
            taxRate,
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
      <View style={styles.inner}>
        <Text style={styles.kicker}>Quick invoice</Text>
        {step === "who" ? (
          <>
            <Text style={styles.prompt}>Who are you billing?</Text>
            <TextInput
              style={styles.input}
              value={clientName}
              onChangeText={setClientName}
              placeholder="Client or company"
              placeholderTextColor="#9ca3af"
              autoFocus
            />
            <Pressable
              style={[styles.btn, !clientName.trim() && styles.disabled]}
              disabled={!clientName.trim()}
              onPress={() => setStep("what")}
            >
              <Text style={styles.btnText}>Next</Text>
            </Pressable>
          </>
        ) : null}

        {step === "what" ? (
          <>
            <Text style={styles.prompt}>What for?</Text>
            <Text style={styles.meta}>Billing {clientName}</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="e.g. Website redesign"
              placeholderTextColor="#9ca3af"
              autoFocus
            />
            <View style={styles.row}>
              <Pressable style={styles.ghost} onPress={() => setStep("who")}>
                <Text style={styles.ghostText}>Back</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, !description.trim() && styles.disabled]}
                disabled={!description.trim()}
                onPress={() => setStep("amount")}
              >
                <Text style={styles.btnText}>Next</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        {step === "amount" ? (
          <>
            <Text style={styles.prompt}>How much (before tax)?</Text>
            <Text style={styles.meta}>
              {description} · {clientName}
            </Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor="#9ca3af"
              autoFocus
            />
            <Text style={styles.hint}>Tax default 18% — edit later on web if needed.</Text>
            <View style={styles.row}>
              <Pressable style={styles.ghost} onPress={() => setStep("what")}>
                <Text style={styles.ghostText}>Back</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, !(rate > 0) && styles.disabled]}
                disabled={!(rate > 0)}
                onPress={() => setStep("confirm")}
              >
                <Text style={styles.btnText}>Review</Text>
              </Pressable>
            </View>
          </>
        ) : null}

        {step === "confirm" ? (
          <>
            <Text style={styles.prompt}>Send it?</Text>
            <View style={styles.card}>
              <Text style={styles.cardLine}>{clientName}</Text>
              <Text style={styles.cardMuted}>{description}</Text>
              <Text style={styles.cardMuted}>
                Subtotal {rate.toLocaleString()} · Tax{" "}
                {preview.tax.toLocaleString()}
              </Text>
              <Text style={styles.cardTotal}>
                Total {preview.total.toLocaleString()}
              </Text>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.row}>
              <Pressable style={styles.ghost} onPress={() => setStep("amount")}>
                <Text style={styles.ghostText}>Back</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, busy && styles.disabled]}
                disabled={busy}
                onPress={() => void create()}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Create & share-ready</Text>
                )}
              </Pressable>
            </View>
          </>
        ) : null}

        <Pressable
          style={{ marginTop: 24 }}
          onPress={() => navigation.navigate("NewInvoice")}
        >
          <Text style={styles.link}>Need full form instead?</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0b1412" },
  inner: { flex: 1, justifyContent: "center", padding: 24 },
  kicker: {
    color: "#7ddec8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  prompt: {
    color: "#eef3f1",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  meta: { color: "#94a3b8", marginBottom: 14, fontSize: 14 },
  hint: { color: "#64748b", fontSize: 12, marginBottom: 14 },
  input: {
    backgroundColor: "#13201c",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    color: "#eef3f1",
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 10, alignItems: "center" },
  btn: {
    flex: 1,
    backgroundColor: "#2f9b84",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  ghost: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  ghostText: { color: "#94a3b8", fontWeight: "600" },
  disabled: { opacity: 0.5 },
  card: {
    backgroundColor: "#13201c",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginBottom: 16,
    gap: 6,
  },
  cardLine: { color: "#eef3f1", fontSize: 18, fontWeight: "700" },
  cardMuted: { color: "#94a3b8", fontSize: 14 },
  cardTotal: { color: "#7ddec8", fontSize: 20, fontWeight: "700", marginTop: 6 },
  error: { color: "#fca5a5", marginBottom: 12 },
  link: { color: "#7ddec8", textAlign: "center", fontWeight: "600" },
});
