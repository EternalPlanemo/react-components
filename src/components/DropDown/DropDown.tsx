import React, {
    useState,
    Children,
    cloneElement,
    useEffect,
    useRef,
} from 'react';

import './DropDownStyle.scss';

export type DropDownProps = {
    mainElement: React.ReactNode;
    children?: React.ReactNode;
    overlayColor?: string | 'transparent';
    onLinkClicked?: () => void;
    position?: DropDownPosition;
}

const positions = ['top', 'right', 'bottom', 'left'] as const;
export type DropDownPosition = typeof positions[number];

const add = (prop: string, cond: boolean) => cond ? prop : ''; 

const getOverflow = (elem: HTMLDivElement) => {
	// Get element's bounding
	let bounding = elem.getBoundingClientRect();

	// Check if it's out of the viewport on each side
	let out = {
        top:    false,
        left:   false,
        bottom: false,
        right:  false,
        any:    false,
        all:    false
    };
	out.top = bounding.top < 0;
	out.left = bounding.left < 0;
	out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
	out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	out.any = out.top || out.left || out.bottom || out.right;
	out.all = out.top && out.left && out.bottom && out.right;

	return out;
};

export const DropDown = ({ mainElement, children, overlayColor }: DropDownProps) => {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const [position, setPosition] = useState('right' as DropDownPosition);
    
    const handleLinkClick = (index: number) => {
        return () => {
            setActive(index);
            setOpen(index === 0);
        }
    }

    const body = useRef<HTMLDivElement | null>(null);
    const dropdown = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!body.current || !dropdown.current) return;

        const overflow = getOverflow(body.current);

        if (overflow.right) {
            setPosition('left');
        } else if (overflow.left) {
            setPosition('right')
        }
    }, [open])

    return (
        <div className={`dropdown ${add('is-active', open)}`} ref={dropdown}>
            <div className="dropdown__head">
                <button
                    className={`dropdown__link ${add('is-active', active === 0)}`} 
                    onClick={handleLinkClick(0)}
                >
                    { mainElement }
                </button>
            </div>

            <div className="dropdown__body" ref={body} data-position={position}>
                { 
                    Children.map(children, (child, index) => (
                        <button 
                            key={index} 
                            className={`dropdown__link ${add('is-active', active === index + 1)}`} 
                            onClick={handleLinkClick(++index)}
                        >
                            { 
                                cloneElement(child as React.ReactElement, { index: index })
                            }
                        </button>
                    )) 
                }
            </div>

            <div className="dropdown__footer">
                <div
                    className={`overlay ${add('is-active', open)}`}
                    onClick={() => {
                        setOpen(false);
                        setActive(-1);
                    }}
                    style={{
                        '--overlay-color': overlayColor || 'rgba(0, 0, 0, 0.5)'
                    } as React.CSSProperties }
                ></div>
            </div>
        </div>
    )
}

export default DropDown;