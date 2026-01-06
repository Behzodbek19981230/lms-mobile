import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

type ToastOptions = {
  title: string;
  message?: string;
};

export function showToast(type: ToastType, { title, message }: ToastOptions) {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 2500,
  });
}

export function showSuccess(title: string, message?: string) {
  showToast('success', { title, message });
}

export function showError(title: string, message?: string) {
  showToast('error', { title, message });
}

export function showInfo(title: string, message?: string) {
  showToast('info', { title, message });
}
