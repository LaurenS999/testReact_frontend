function NoteList({ notes }) {
  return (
    <div>
      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.judul}</h3>
          <p>
            {note.isi_konten.length > 100
              ? note.content.substring(0, 100) + '...'
              : note.content}
          </p>
        </div>
      ))}
    </div>
  );
}