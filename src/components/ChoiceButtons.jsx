export default function ChoiceButtons({ onYes, onNo }) {
    return (
      <div className="flex gap-6 mt-8">
        <button
          onClick={onYes}
          className="px-6 py-3 bg-rose text-white rounded-full text-lg"
        >
          YES 💖
        </button>
  
        <button
          onClick={onNo}
          className="px-6 py-3 bg-gray-300 rounded-full text-lg"
        >
          NO 😏
        </button>
      </div>
    );
  }
  