import React, { useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { colors, radii } from '../theme/colors';
import { t } from '../i18n';
import { showError, showSuccess } from '../ui/toast';

export function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.length > 0 && !submitting;
  }, [username, password, submitting]);

  const onSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      showSuccess(t('auth').loginSuccessTitle, t('auth').loginSuccessMessage);
    } catch (e: any) {
      const message =
        e?.response?.data?.message || e?.message || t('auth').submitErrorFallback;
      showError(
        t('auth').submitErrorTitle,
        typeof message === 'string' ? message : t('auth').submitErrorFallback,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Image
            source={require('../assets/images/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{t('auth').title}</Text>
          <Text style={styles.subtitle}>{t('auth').loginTitle}</Text>

          <Text style={styles.label}>{t('auth').usernameLabel}</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder={t('auth').usernamePlaceholder}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            editable={!submitting}
            returnKeyType="next"
          />

          <Text style={styles.label}>{t('auth').passwordLabel}</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth').passwordPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            style={styles.input}
            editable={!submitting}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />

          <TouchableOpacity
            onPress={onSubmit}
            disabled={!canSubmit}
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.buttonText}>{t('auth').submit}</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>{t('appName')} LMS</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 20,
  },
  logo: {
    width: 84,
    height: 84,
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.input,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  button: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.primaryForeground,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    textAlign: 'center',
    marginTop: 18,
    color: colors.mutedForeground,
    fontSize: 12,
  },
});
