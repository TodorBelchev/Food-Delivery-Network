import classes from './Spinner.module.css';

type SpinnerProps = JSX.IntrinsicElements['div'] & {
    size?: string
}

const Spinner: React.FC<SpinnerProps> = (props) => {
    return (
        <div className={`
            ${classes['lds-dual-ring']}
            ${props.size === 'small' ? classes.small : ''}
            ${props.size === 'medium' ? classes.medium : ''}`}
        >
        </div>
    )
}

export default Spinner;