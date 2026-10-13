import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export const C = { bg: '#0b1220', card: '#131c2e', text: '#f1f5f9', dim: '#94a3b8', blue: '#2563eb', red: '#dc2626', green: '#16a34a', amber: '#d97706' };

export function Btn({ label, onPress, color = C.blue, disabled }: { label: string; onPress: () => void; color?: string; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[s.btn, { backgroundColor: color, opacity: disabled ? 0.5 : 1 }]}>
      <Text style={s.btnText}>{label}</Text>
    </Pressable>
  );
}

export const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, padding: 16 },
  btn: { paddingVertical: 18, borderRadius: 14, alignItems: 'center', marginVertical: 6 },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  input: { backgroundColor: C.card, color: C.text, borderRadius: 12, padding: 14, fontSize: 18, marginVertical: 6 },
  text: { color: C.text, fontSize: 16 },
  dim: { color: C.dim, fontSize: 14 },
  code: { color: C.text, fontSize: 48, fontWeight: '800', letterSpacing: 8, textAlign: 'center', marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  err: { color: '#f87171', marginVertical: 6 },
});
