export default function ChatBox() {
  return (
    <div className="w-full max-w-3xl">

      <div className="h-[500px] bg-gray-900 rounded-xl p-5 text-white">

        <div className="mb-5">
          <p className="text-blue-400">
            You:
          </p>
          <p>
            Explain Django
          </p>
        </div>


        <div>
          <p className="text-green-400">
            CodeMentor AI:
          </p>
          <p>
            Django is a Python web framework.
          </p>
        </div>

      </div>


      <div className="flex mt-4">

        <input
          className="flex-1 p-3 bg-gray-800 text-white rounded-l-lg"
          placeholder="Ask coding question..."
        />

        <button className="bg-blue-600 px-5 rounded-r-lg">
          Send
        </button>

      </div>

    </div>
  );
}