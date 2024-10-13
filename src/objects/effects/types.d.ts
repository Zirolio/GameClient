interface TrailConfig {
    length: number;
    width: number;

    trailCap: 'square' | 'round' | 'butt';

    startColor: string;
    endColor: string;
}