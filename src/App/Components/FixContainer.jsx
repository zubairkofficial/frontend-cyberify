const FixContainer = ({ children, height }) => {
    return <div style={{height, overflow: 'auto', padding: 10}}>{ children }</div>
}

export default FixContainer;