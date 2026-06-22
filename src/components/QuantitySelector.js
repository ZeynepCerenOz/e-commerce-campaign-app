export default function QuantitySelector({ quantity, onChange }) {
    const handleChange = (e) => {
      const val = parseInt(e.target.value);
      if (!isNaN(val) && val >= 1) {
        onChange(val);
      }
    };
  
    return (
      <input
        type="number"
        className="form-control"
        min="1"
        value={quantity}
        onChange={handleChange}
      />
    );
  }
  