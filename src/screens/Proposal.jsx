import NoButton from "../components/NoButton";

export default function Proposal() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl mb-8">Will you be my Valentine? 💖</h1>

      <div className="flex gap-8">
        <button
          onClick={() => alert("SHE SAID YES 😭💍")}
          className="px-6 py-3 bg-rose text-white rounded-full text-lg"
        >
          YES 💘
        </button>

        <NoButton />
      </div>
    </div>
  );
}
