import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  MoreVertical, 
  Eye, 
  Edit3, 
  Trash2, 
  Activity,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ThresholdBadge from '../common/ThresholdBadge';
import PlantModal from './PlantModal';
import PlantDetailDrawer from './PlantDetailDrawer';
import Modal from '../common/Modal';

const PlantManagementView = () => {
  const { plants, deletePlant, setActiveTab, setLiveMonitoring } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSpecies, setSelectedSpecies] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [plantToEdit, setPlantToEdit] = useState(null);
  const [plantToView, setPlantToView] = useState(null);
  const [plantToDelete, setPlantToDelete] = useState(null);

  // Extract unique species for filter
  const speciesList = useMemo(() => {
    return Array.from(new Set(plants.map(p => p.species)));
  }, [plants]);

  // Filter plants
  const filteredPlants = useMemo(() => {
    return plants.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.species.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchesSpecies = selectedSpecies === 'ALL' || p.species === selectedSpecies;

      return matchesSearch && matchesStatus && matchesSpecies;
    });
  }, [plants, searchTerm, selectedStatus, selectedSpecies]);

  const handleLaunchLive = (plant) => {
    setLiveMonitoring(prev => ({
      ...prev,
      selectedPlantId: plant.id,
      selectedExperimentId: plant.experimentId || prev.selectedExperimentId,
      active: true
    }));
    setActiveTab('live');
  };

  const confirmDelete = () => {
    if (plantToDelete) {
      deletePlant(plantToDelete.id);
      setPlantToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Plant Specimen Inventory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage experimental botanical specimens, phenotyping notes and optical calibration
          </p>
        </div>

        <button
          onClick={() => { setPlantToEdit(null); setIsAddModalOpen(true); }}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm shadow-emerald-900/20 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Plant</span>
        </button>
      </div>

      {/* Filter and View Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plant ID, name, or variety..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Health States</option>
            <option value="Healthy">Optimal (Healthy)</option>
            <option value="Moderate Stress">Moderate Stress</option>
            <option value="Severe Stress">Severe Stress</option>
          </select>

          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="ALL">All Species</option>
            {speciesList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Main Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Plant ID</th>
                  <th className="py-3 px-4">Specimen Name</th>
                  <th className="py-3 px-4">Species & Cultivar</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Experiment</th>
                  <th className="py-3 px-4 font-mono">RED (660nm)</th>
                  <th className="py-3 px-4 font-mono">NIR (850nm)</th>
                  <th className="py-3 px-4 font-mono">Index</th>
                  <th className="py-3 px-4">Provisional Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredPlants.map(plant => (
                  <tr key={plant.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {plant.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {plant.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="italic text-slate-700">{plant.species}</span>
                      <span className="block text-[11px] text-slate-400">{plant.variety}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{plant.location}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {plant.experimentId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-600 font-bold">{plant.redReflectance}</td>
                    <td className="py-3 px-4 font-mono text-indigo-600 font-bold">{plant.nirReflectance}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700">{plant.provisionalIndex}</td>
                    <td className="py-3 px-4">
                      <ThresholdBadge status={plant.status} indexValue={plant.provisionalIndex} showProvisional />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setPlantToView(plant)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Inspect Plant Profile & History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleLaunchLive(plant)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Live Optical Monitoring"
                        >
                          <Activity className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setPlantToEdit(plant); setIsAddModalOpen(true); }}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPlantToDelete(plant)}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Specimen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlants.map(plant => (
            <div 
              key={plant.id} 
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {plant.id}
                  </span>
                  <ThresholdBadge status={plant.status} indexValue={plant.provisionalIndex} showProvisional />
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-3">{plant.name}</h3>
                <p className="text-xs text-slate-500 italic mt-0.5">{plant.species}</p>
                <p className="text-[11px] text-slate-400">Variety: {plant.variety}</p>

                <div className="mt-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Index:</span>
                    <strong className="text-slate-900">{plant.provisionalIndex}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>RED (660nm):</span>
                    <span className="text-rose-600 font-bold">{plant.redReflectance}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>NIR (850nm):</span>
                    <span className="text-indigo-600 font-bold">{plant.nirReflectance}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPlantToView(plant)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Details</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleLaunchLive(plant)}
                    className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                    title="Live Monitor"
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { setPlantToEdit(plant); setIsAddModalOpen(true); }}
                    className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPlantToDelete(plant)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PlantModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        plantToEdit={plantToEdit}
      />

      <PlantDetailDrawer
        isOpen={!!plantToView}
        onClose={() => setPlantToView(null)}
        plant={plantToView}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!plantToDelete}
        onClose={() => setPlantToDelete(null)}
        title="Confirm Specimen Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to delete this plant specimen?</p>
              <p className="mt-1 text-rose-700 leading-relaxed">
                Deleting <strong>{plantToDelete?.name} ({plantToDelete?.id})</strong> will remove it from all monitoring charts and discard its logged optical readings.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setPlantToDelete(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors"
            >
              Yes, Delete Plant
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default PlantManagementView;
