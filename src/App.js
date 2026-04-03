import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(null);
  
  const [newjudul, setNewJudul] = useState('');
  const [newisi_konten, setNewIsi_Konten] = useState('');

  const [editjudul, setEditJudul] = useState('');
  const [editisi_konten, setEditIsi_konten] = useState('');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  //Paging Item
  const [currentPage, setCurrentPage] = useState(1); // halaman saat ini
  const notesPerPage = 7; // jumlah note per halaman

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  const getPaginationItems = () => {
    const totalPages = Math.ceil(notes.length / notesPerPage);
    const maxVisible = 5;
    
    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    const pages = [];

    // Tombol pertama (jika start > 1 dan tombol pertama belum termasuk)
    if (start > 1) {
      pages.push(1);
    }

    // Ellipsis kiri
    if (start > 2) {
      pages.push("left-ellipsis");
    }

    // Tombol tengah
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Ellipsis kanan
    if (end < totalPages - 1) {
      pages.push("right-ellipsis");
    }

    // Tombol terakhir (hanya jika end < totalPages dan tombol terakhir belum termasuk)
    if (end < totalPages && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const fetchNotes = async () => {
    const res = await axios.get(`${API_URL}/notes?search=${search}`);
    setNotes(res.data);
  };

  const handleAddNote = async () => {
  try {
    
      await axios.post(`${API_URL}/notes`, {
        judul: newjudul,
      isi_konten: newisi_konten
      });

      setNewJudul('');
      setNewIsi_Konten('');

      setShowAddModal(false);

      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditNote = async () => {
  try {
    if (!showDetailModal.id) {
      console.error("Note id missing!");
      return;
    }

    await axios.put(`${API_URL}/notes/${showDetailModal.id}`, {
      judul: editjudul,
      isi_konten: editisi_konten
    });
    
    setShowDetailModal(null);
    fetchNotes(); // refresh data
  } catch (error) {
    console.error(error);
  }
};

const handleDeleteNote = async (id) => {
  try {
    if (!noteToDelete) {
      console.error("Note id missing!");
      return;
    }

    await axios.delete(`${API_URL}/notes/${noteToDelete}`, { 
    });

    setShowConfirmModal(false);
    setNoteToDelete(null);
    setShowDetailModal(null);
    fetchNotes(); // refresh data
  } catch (error) {
    console.error(error);
  }
}

const openModal = (note) => {
  setShowDetailModal(note);
  setEditJudul(note.judul);
  setEditIsi_konten(note.isi_konten);
};

const confirmDeleteNote = (id) => {
  setNoteToDelete(id);        // simpan id note yang ingin dihapus
  setShowConfirmModal(true);  // tampilkan modal
};

    useEffect(() => {

    const timeout = setTimeout(() => {
      fetchNotes();
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="Body">
      <h1>Notes App</h1>

      <div>
        <input
          className='searchBox'
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={() => setShowAddModal(true)}>Tambah Note</button>
      </div>

      {currentNotes.map(note => (
        <div className="note-card" key={note.id} onClick={() => openModal(note)}>
          <div className="note-header">
            <h3>{note.judul}</h3>
            <span className="note-date">
              {new Date(note.tanggal_pembuatan).toLocaleDateString()}
            </span>
          </div>
          <p>
            {note.isi_konten.length > 50
              ? note.isi_konten.substring(0, 50) + "..."
              : note.isi_konten}
          </p>
        </div>
      ))}

      <div className="pagination">
        {getPaginationItems().map((item, idx) =>
          typeof item === "number" ? (
            <button
              key={`page-${item}`} // pastikan key unik
              onClick={() => setCurrentPage(item)}
              className={currentPage === item ? "active" : ""}
            >
              {item}
            </button>
          ) : (
            <span key={`ellipsis-${idx}`} className="ellipsis">...</span>
          )
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className='modal-title'>Tambah Note</h2>

            <input
              type="text"
              placeholder="Judul"
              value={newjudul}
              onChange={(e) => setNewJudul(e.target.value)}
            />

            <textarea
              placeholder="Isi catatan"
              value={newisi_konten}
              onChange={(e) => setNewIsi_Konten(e.target.value)}
            ></textarea>

            <div className="modal-actions">
              <button onClick={handleAddNote}>Simpan</button>
              <button onClick={() => setShowAddModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className='modal-title'>Detail Note</h2>

            <input
              type="text"
              placeholder="Judul"
              value={editjudul}
              onChange={(e) => setEditJudul(e.target.value)}
            />

            <textarea
              placeholder="Isi catatan"
              
              value={editisi_konten}
              onChange={(e) => setEditIsi_konten(e.target.value)}
            ></textarea>

            <div className="modal-actions">
              <button onClick={handleEditNote}>
                    Ubah
              </button>
              <button onClick={() => confirmDeleteNote(showDetailModal.id)}>Hapus</button>
              <button onClick={() => setShowDetailModal(null)}>Batal</button>
            </div>
          </div>
        </div>
      )}


      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Konfirmasi Hapus</h3>
            <p>Apakah Anda yakin ingin menghapus note ini?</p>

            <div className="modal-actions">
              <button onClick={handleDeleteNote}>Ya, Hapus</button>
              <button onClick={() => setShowConfirmModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
