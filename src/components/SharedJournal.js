import Image from 'next/image';

const SharedJournal = ({ journalEntries }) => {
  return (
    <div>
      {journalEntries.map((entry, index) => (
        <div key={index}>
          <h2>{entry.title}</h2>
          <p>{entry.content}</p>
          {entry.image && (
            <Image
              src={entry.image}
              alt={entry.title}
              width={500}
              height={300}
              layout="responsive"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default SharedJournal;