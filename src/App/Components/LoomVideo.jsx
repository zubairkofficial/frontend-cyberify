const LoomVideo = ({ videoId, className = "" }) => {
    return (
        <div style={{  }}>
            <iframe src={`https://www.loom.com/embed/${videoId}`} frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen className={className}></iframe>
        </div>
    )
}

export default LoomVideo;