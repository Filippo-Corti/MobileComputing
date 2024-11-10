import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';

interface PrimaryGradientProps {
    styles? : any,
    children?: ReactNode;
}


export default function PrimaryGradient({
    children,
    styles,
}: PrimaryGradientProps) {
    return (
        <LinearGradient
            colors={[Colors.light.primary, Colors.light.secondary]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles}
        >
            {children}
        </LinearGradient>
    )
}