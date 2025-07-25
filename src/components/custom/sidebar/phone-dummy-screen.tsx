import { cn } from '@/lib/utils';
import React from 'react';

interface PhoneDummyScreenProps {
  image: string;
  width: number;
  aspectRatio: string;
}

const PhoneDummyScreen: React.FC<PhoneDummyScreenProps> = ({ image, width, aspectRatio = "9/16" }) => {
    const borderSize = width >= 100 ? 4 : 2;

    return (
        <div className={
            cn(
                'flex overflow-visible',
            )}
            style={
                {
                    width: `${width}px`,
                    height: `${width * (16/9)}px`,
                    maxWidth: `${width}px`,
                    maxHeight: `${width * (16/9)}px`,
                }
            }
            >
                <div className={`border-${borderSize} rounded-md overflow-hidden border-background/80`}
                >
                    <img src={image} alt="Phone wallpaper" className={`object-cover block aspect-[${aspectRatio}] h-full`} />
                </div>
        </div>
    );
};

export default PhoneDummyScreen;
