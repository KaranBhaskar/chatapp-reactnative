import * as Network from "expo-network";
import { useEffect, useMemo, useState } from "react";

export function useNetworkStatus() {
  const [state, setState] = useState({ isConnected: true, isInternetReachable: true });

  useEffect(() => {
    let mounted = true;

    Network.getNetworkStateAsync()
      .then((nextState) => {
        if (mounted) {
          setState(nextState);
        }
      })
      .catch(() => {
        if (mounted) {
          setState({ isConnected: true, isInternetReachable: true });
        }
      });

    const subscription = Network.addNetworkStateListener((nextState) => {
      setState(nextState);
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return useMemo(() => {
    const isOffline = state.isConnected === false || state.isInternetReachable === false;

    return {
      isOffline,
      networkState: state,
    };
  }, [state]);
}
