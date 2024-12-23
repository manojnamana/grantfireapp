// @ts-nocheck

import React, { useState } from 'react';
import { Search, Menu, Mail, MessageSquare, Upload, Link, FileText, Edit2, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog } from '@/components/ui/dialog';

const Header = ({ mode, setMode, setShowNotification }) => (
  <div className="w-full bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-gray-900">Grantfire</span>
          </div>
          
          <div className="ml-6 flex space-x-4">
            <button
              onClick={() => setMode('search')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                mode === 'search'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Search className="inline-block w-4 h-4 mr-1" />
              Search Mode
            </button>
            <button
              onClick={() => setMode('partner')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                mode === 'partner'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Menu className="inline-block w-4 h-4 mr-1" />
              Partner Mode
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNotification(true)}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700"
          >
            <Mail className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-700">
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  const [mode, setMode] = useState('search');
  const [showNotification, setShowNotification] = useState(false);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showExternalPartnerModal, setShowExternalPartnerModal] = useState(false);
  const [selectedPartners, setSelectedPartners] = useState({
    Sageco: false,
    MTN: false
  });
  const [backgroundInfo, setBackgroundInfo] = useState('');
  const [externalPartnerInfo, setExternalPartnerInfo] = useState({
    contact: '',
    contactType: 'email',
    info: '',
    background: ''
  });
  const [draftAgreements, setDraftAgreements] = useState([]);

  const handleGrantSelection = (grant) => {
    setSelectedGrant(grant);
    setShowPartnerModal(true);
  };

  const handlePartnerSelection = () => {
    if (!selectedPartners.Sageco && !selectedPartners.MTN) {
      return; // At least one partner must be selected
    }
    setShowPartnerModal(false);
    setShowExternalPartnerModal(true);
  };

  const handleExternalPartnerSubmit = () => {
    const newDraft = {
      id: Date.now(),
      grant: selectedGrant,
      internalPartners: selectedPartners,
      externalPartner: externalPartnerInfo,
      backgroundInfo: backgroundInfo,
      status: 'draft',
      comments: [],
      lastUpdated: new Date()
    };
    setDraftAgreements([...draftAgreements, newDraft]);
    setShowExternalPartnerModal(false);
  };

  const PartnerSelectionModal = () => (
    <Dialog
      open={showPartnerModal}
      onClose={() => setShowPartnerModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Select Internal Partner</h3>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedPartners.Sageco}
              onChange={() => setSelectedPartners(prev => ({
                ...prev,
                Sageco: !prev.Sageco
              }))}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <span>Sageco</span>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedPartners.MTN}
              onChange={() => setSelectedPartners(prev => ({
                ...prev,
                MTN: !prev.MTN
              }))}
              className="h-4 w-4 border-gray-300 rounded"
            />
            <span>MTN</span>
          </label>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Background Information
            </label>
            <textarea
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="Enter background information..."
              value={backgroundInfo}
              onChange={(e) => setBackgroundInfo(e.target.value)}
              rows={4}
            />
          </div>

          <button
            onClick={handlePartnerSelection}
            disabled={!selectedPartners.Sageco && !selectedPartners.MTN}
            className="w-full mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 
              disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </Dialog>
  );

  const ExternalPartnerModal = () => (
    <Dialog
      open={showExternalPartnerModal}
      onClose={() => setShowExternalPartnerModal(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">External Partner Information (Optional)</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Contact Method
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setExternalPartnerInfo(prev => ({...prev, contactType: 'email'}))}
                className={`p-2 rounded-md ${externalPartnerInfo.contactType === 'email' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100'}`}
              >
                <Mail className="w-5 h-5" />
              </button>
              <button
                onClick={() => setExternalPartnerInfo(prev => ({...prev, contactType: 'phone'}))}
                className={`p-2 rounded-md ${externalPartnerInfo.contactType === 'phone' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100'}`}
              >
                <Phone className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {externalPartnerInfo.contactType === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={externalPartnerInfo.contactType === 'email' ? 'email' : 'tel'}
              className="mt-1 w-full p-2 border rounded-md"
              placeholder={externalPartnerInfo.contactType === 'email' ? 
                'Enter email address' : 'Enter phone number'}
              value={externalPartnerInfo.contact}
              onChange={(e) => setExternalPartnerInfo(prev => ({
                ...prev,
                contact: e.target.value
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Partner Information
            </label>
            <textarea
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="Enter URL, mission statement, or other information..."
              value={externalPartnerInfo.info}
              onChange={(e) => setExternalPartnerInfo(prev => ({
                ...prev,
                info: e.target.value
              }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Background Information
            </label>
            <textarea
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="Enter background information..."
              value={externalPartnerInfo.background}
              onChange={(e) => setExternalPartnerInfo(prev => ({
                ...prev,
                background: e.target.value
              }))}
              rows={4}
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                handleExternalPartnerSubmit();
                setShowExternalPartnerModal(false);
              }}
              className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300"
            >
              Skip External Partner
            </button>
            <button
              onClick={handleExternalPartnerSubmit}
              disabled={!externalPartnerInfo.contact && externalPartnerInfo.info}
              className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
            >
              Continue with Partner
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );

  const SearchMode = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search grants and contracts..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Grant or Contract Description {item}
            </h3>
            <p className="text-gray-600 mb-4">
              Detailed information about the grant or contract...
            </p>
            <button 
              onClick={() => handleGrantSelection({
                id: item,
                description: `Grant or Contract Description ${item}`,
                details: 'Detailed information about the grant or contract...'
              })}
              className="text-blue-600 hover:text-blue-800"
            >
              Select for Partnership →
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const PartnerMode = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Draft Partnership Agreements
        </h2>
        <div className="space-y-4">
          {draftAgreements.map((draft) => (
            <div key={draft.id} className="bg-white p-6 rounded-lg shadow">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Partnership Agreement - {draft.lastUpdated.toLocaleDateString()}
              </h4>
              <div className="space-y-2 mb-4">
                <div>{draft.grant.description}</div>
                <div>Internal Partners: {
                  Object.entries(draft.internalPartners)
                    .filter(([_, selected]) => selected)
                    .map(([partner]) => partner)
                    .join(', ')
                }</div>
                {draft.externalPartner?.contact && (
                  <div>External Partner Contact: {draft.externalPartner.contact}</div>
                )}
                {draft.backgroundInfo && (
                  <div>Background Info: {draft.backgroundInfo}</div>
                )}
              </div>
              <button 
                onClick={() => {
                  setSelectedGrant(draft.grant);
                  setSelectedPartners(draft.internalPartners);
                  setBackgroundInfo(draft.backgroundInfo);
                  if (draft.externalPartner) {
                    setExternalPartnerInfo(draft.externalPartner);
                  }
                  setShowPartnerModal(true);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                View Draft →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header mode={mode} setMode={setMode} setShowNotification={setShowNotification} />
      
      {showNotification && (
        <Alert className="fixed top-4 right-4 w-96">
          <AlertDescription>
            New message received from partner regarding grant proposal.
            <button 
              onClick={() => setShowNotification(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </AlertDescription>
        </Alert>
      )}

      {mode === 'search' ? <SearchMode /> : <PartnerMode />}
      <PartnerSelectionModal />
      <ExternalPartnerModal />
    </div>
  );
};

export default App;