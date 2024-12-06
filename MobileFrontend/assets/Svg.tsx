import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

type Props = {
    color: string,
    width?: number,
    height?: number,
}

const Icons = {
    ArrowDown: ({ color, width = 24, height = 24, }: Props) => (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
            <Path 
                d="M19 9L12 16L5 9" 
                stroke={color} 
                strokeWidth="1.6"
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </Svg>
    ),
    ChevronLeft: ({ color }: Props) => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path 
                d="M15 19L8 12L15 5" 
                stroke={color} 
                strokeWidth="1.6"
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </Svg>
    ),
    ChevronRight: ({ color }: Props) => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path 
                d="M9 5L16 12L9 19" 
                stroke={color} 
                strokeWidth="1.6"
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </Svg>
    ),
    ArrowRight: ({ color }: Props) => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path 
                d="M7 12H17M17 12L13 8M17 12L13 16" 
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </Svg>
    ),
    Facets: ({ color }: Props) => (
        <Svg  width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M10.8333 9.66667L16.6666 9.66667" stroke={color} strokeLinecap="round"/>
            <Path d="M7.33325 14.3333L13.1666 14.3333" stroke={color} strokeLinecap="round"/>
            <Ellipse cx="9.08325" cy="9.66667" rx="1.75" ry="1.75" transform="rotate(90 9.08325 9.66667)" stroke={color} strokeLinecap="round"/>
            <Ellipse cx="14.9167" cy="14.3333" rx="1.75" ry="1.75" transform="rotate(90 14.9167 14.3333)" stroke={color} strokeLinecap="round"/>
            <Rect x="3.5" y="3.5" width="17" height="17" stroke={color} />
        </Svg>
    ),
    Trash: ({ color }: Props) => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path 
                d="M14 10V17M10 10V17M6 6V17.8C6 18.9201 6 19.4798 6.21799 19.9076C6.40973 20.2839 6.71547 20.5905 7.0918 20.7822C7.5192 21 8.07899 21 9.19691 21H14.8031C15.921 21 16.48 21 16.9074 20.7822C17.2837 20.5905 17.5905 20.2839 17.7822 19.9076C18 19.4802 18 18.921 18 17.8031V6M6 6H8M6 6H4M8 6H16M8 6C8 5.06812 8 4.60241 8.15224 4.23486C8.35523 3.74481 8.74432 3.35523 9.23438 3.15224C9.60192 3 10.0681 3 11 3H13C13.9319 3 14.3978 3 14.7654 3.15224C15.2554 3.35523 15.6447 3.74481 15.8477 4.23486C15.9999 4.6024 16 5.06812 16 6M16 6H18M18 6H20" 
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </Svg>
    ),
    Plus: ({ color }: Props) => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path 
                d="M8 12H12M12 12H16M12 12V16M12 12V8M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" 
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </Svg>
    ),
    Minus: ({ color }: Props) => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path
                d="M8 12H16M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" 
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </Svg>
    )
};

export default Icons;

